import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TechnicalService } from '../technical.service';
import {Technical} from './../technical'
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-create-technical',
  templateUrl: './create-technical.component.html',
  styleUrls: ['./create-technical.component.css']
})
export class CreateTechnicalComponent implements OnInit {

  technicalForm: FormGroup
  technicals: Technical[] = []
  selectedTechnical: Technical
  searchText = ""

  constructor(
    private fb: FormBuilder,
    private technicalService: TechnicalService,
    private notifier: NotifierService
  ) { 
    this.technicalForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      argname: [''],
      argDefaultValue: ['']
    })
  }

  ngOnInit() {
    this.selectedTechnical = new Technical()
    this.updateTechnicalList()
  }

  updateTechnicalList(){
    this.technicalService.getList().subscribe(result => {
      this.technicals = result
    })
  }

  addToArgList(){
    this.selectedTechnical.tech_args[
      this.technicalForm.get('argname').value
    ] = this.technicalForm.get('argDefaultValue').value
    this.technicalForm.get('argname').setValue("")
    this.technicalForm.get('argDefaultValue').setValue("")
  }

  removeFromArgList(item){
    delete this.selectedTechnical.tech_args[item.key]
  }

  save(){
    this.selectedTechnical.name = this.technicalForm.get('name').value
    this.selectedTechnical.description = this.technicalForm.get('description').value
    if (this.selectedTechnical._id && this.selectedTechnical._id !=="") {
      this.technicalService.update(this.selectedTechnical).subscribe(result=>{
        this.updateTechnicalList()
        this.reset()
        this.notifier.notify("success", result['msg'])
      })
    } else {
      this.technicalService.add(this.selectedTechnical).subscribe(result=>{
        this.updateTechnicalList()
        this.reset()
        this.notifier.notify("success", result['msg'])
      }) 
    }
  }

  reset(){
    this.technicalForm.get('name').setValue("")
    this.technicalForm.get("description").setValue("")
    this.selectedTechnical = new Technical()
  }

  selectTechnical(index){
    this.selectedTechnical = this.technicals[index]
    this.technicalForm.get('name').setValue(this.selectedTechnical.name)
    this.technicalForm.get('description').setValue(this.selectedTechnical.description)
  }

  onRemove(id, index){
    this.technicalService.delete(id).subscribe(result=>{
      this.technicals.splice(index, 1)
      this.notifier.notify("success", result['msg'])
    })
  }
}
