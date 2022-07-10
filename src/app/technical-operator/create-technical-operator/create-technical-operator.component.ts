import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TechnicalOperatorService } from '../technical-operator.service';
import {TechnicalOperator} from './../technical-operator'
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-create-technical',
  templateUrl: './create-technical-operator.component.html',
  styleUrls: ['./create-technical-operator.component.css']
})
export class CreateTechnicalOperatorComponent implements OnInit {

  technicalForm: FormGroup
  operators: TechnicalOperator[] = []
  selectedTechnicalOperator: TechnicalOperator

  constructor(
    private fb: FormBuilder,
    private technicalOperatorService: TechnicalOperatorService,
    private notifier: NotifierService
  ) { 
    this.technicalForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      isUnary: [''],
      argname: [''],
      argDefaultValue: ['']
    })
  }

  ngOnInit() {
    this.selectedTechnicalOperator = new TechnicalOperator()
    this.updateTechnicalList()
  }

  updateTechnicalList(){
    this.technicalOperatorService.getList().subscribe(result => {
      this.operators = result
    })
  }

  addToArgList(){
    this.selectedTechnicalOperator.tech_args[
      this.technicalForm.get('argname').value
    ] = this.technicalForm.get('argDefaultValue').value
    this.technicalForm.get('argname').setValue("")
    this.technicalForm.get('argDefaultValue').setValue("")
    this.technicalForm.get("isUnary").setValue(false)
  }

  removeFromArgList(item){
    delete this.selectedTechnicalOperator.tech_args[item.key]
  }

  save(){
    this.selectedTechnicalOperator.name = this.technicalForm.get('name').value
    this.selectedTechnicalOperator.description = this.technicalForm.get('description').value
    this.selectedTechnicalOperator.is_unary = this.technicalForm.get("isUnary").value
    if (this.selectedTechnicalOperator._id && this.selectedTechnicalOperator._id !=="") {
      this.technicalOperatorService.update(this.selectedTechnicalOperator).subscribe(result=>{
        this.updateTechnicalList()
        this.reset()
        this.notifier.notify("success", result['msg'])
      })
    } else {
      this.technicalOperatorService.add(this.selectedTechnicalOperator).subscribe(result=>{
        this.updateTechnicalList()
        this.reset()
        this.notifier.notify("success", result['msg'])
      }) 
    }
  }

  reset(){
    this.technicalForm.get('name').setValue("")
    this.technicalForm.get("description").setValue("")
    this.selectedTechnicalOperator = new TechnicalOperator()
  }

  selectTechnicalOperator(index){
    this.selectedTechnicalOperator = this.operators[index]
    this.technicalForm.get('name').setValue(this.selectedTechnicalOperator.name)
    this.technicalForm.get('description').setValue(this.selectedTechnicalOperator.description)
  }

  onRemove(id, index){
    this.technicalOperatorService.delete(id).subscribe(result=>{
      this.operators.splice(index, 1)
      this.notifier.notify("success", result['msg'])
    })
  }
}
