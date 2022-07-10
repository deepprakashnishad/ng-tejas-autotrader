import { Component, OnInit, Output, EventEmitter, ViewChild, Input, OnChanges, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TechnicalService } from './../technical.service';
import { Technical } from './../technical';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import { TechnicalDetailDialogComponent } from '../technical-detail-dialog/technical-detail-dialog.component';

@Component({
  selector: 'app-technical-search',
  templateUrl: './technical-search.component.html',
  styleUrls: ['./technical-search.component.css']
})
export class TechnicalSearchComponent implements OnInit, OnChanges {

  @Input() disabled: boolean = false; 
  @Input() selectedTechnicalId?: string;
  @Input() selectedTechnical?: Technical;
  @Output() selected = new EventEmitter<Technical>()
  mControl = new FormControl();
  technicals: Array<any>
  itemFilteredList: Observable<Technical[]>
  @ViewChild(MatAutocompleteTrigger, {static: false}) trigger;


  constructor(
    private technicalService: TechnicalService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.technicalService.getList().subscribe(response => this.technicals = response);
    this.itemFilteredList = this.mControl.valueChanges.pipe(
    startWith(''),
    map((filterStr: string | null) => {
      if(filterStr){
        if(typeof filterStr==="string" && filterStr.indexOf("(")==-1)
         return this._filter(filterStr, this.technicals)
        else
          return []
      }else{
        return this.technicals
      }
    }))
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TechnicalDetailDialogComponent, {
      width: '400px',
      height: '400px',
      data: this.selectedTechnical,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.selectedTechnical = result
        this.selected.emit(this.selectedTechnical);
        this.mControl.setValue(this.selectedTechnical)
      }
    });
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}){
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      if(propName==="selectedTechnical" && changedProp.currentValue!==undefined){
        this.mControl.setValue(this.selectedTechnical);
      }
      if(propName==="selectedTechnicalId" && changedProp.currentValue!==undefined){

      }
    }
  }

  onFocus(){
    if(this.selectedTechnical && this.selectedTechnical.name === ""){
      this.trigger._onChange(""); 
      this.trigger.openPanel();
    }else if(this.selectedTechnical){
      this.openDialog()
    }
  }


  _filter(value:string, list: Array<any>): Array<any>{
    const filterValue = value.toLowerCase();
    return list.filter(option => option[1].toLowerCase().includes(filterValue));
  } 

  displayFn(item: any): string | undefined{
    let temp = ""
    if(item.name !== ""){
      temp = "("
      Object.entries(item.tech_args).forEach(ele => {
        temp = temp.concat(`${ele[1]},`)
      });
      temp = temp.slice(0, -1)
      temp = temp.concat(")")
    }
    return item?item.name + temp:undefined
    // return item?item.description:undefined
  }

  itemSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTechnical = event.option.value;
    this.selected.emit(event.option.value);
    if(Object.keys(this.selectedTechnical.tech_args).length > 0){
      this.openDialog()
    }
  }

  clearSelection(){
    this.selectedTechnical = undefined;
    this.mControl.setValue(null);
    this.selected.emit(this.selectedTechnical);
  }
}
