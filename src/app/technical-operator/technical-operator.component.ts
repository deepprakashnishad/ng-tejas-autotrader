import { Component, OnInit, Output, EventEmitter, ViewChild, Input, OnChanges, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Operator } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material';
import { TechnicalOperator } from './technical-operator';

import {MatDialog} from '@angular/material/dialog';
import { TechnicalDetailDialogComponent } from '../technical/technical-detail-dialog/technical-detail-dialog.component';
import { TechnicalOperatorService } from './technical-operator.service';

@Component({
  selector: 'app-technical-operator',
  templateUrl: './technical-operator.component.html',
  styleUrls: ['./technical-operator.component.css']
})
export class TechnicalOperatorComponent implements OnInit, OnChanges {

  @Input() disabled: boolean = false;
  @Input() selectedOperatorId?: string;
  @Input() selectedOperator?: TechnicalOperator;
  @Output() selected = new EventEmitter<TechnicalOperator>()
  mControl = new FormControl();
  itemFilteredList: Observable<TechnicalOperator[]>
  @ViewChild(MatAutocompleteTrigger, {static: false}) trigger;

  operators = new Array<TechnicalOperator>()

  constructor(
    private operatorService: TechnicalOperatorService,
    public dialog: MatDialog
  ) { 
  }

  ngOnInit() {
    this.operatorService.getList().subscribe(response => {
        this.operators = response
      });
    this.itemFilteredList = this.mControl.valueChanges.pipe(
    startWith(''),
    map((filterStr: string | null) => {
      if(filterStr){
        if(typeof filterStr==="string")
         return this._filter(filterStr, this.operators)
      }else{
        return this.operators
      }
    }))
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TechnicalDetailDialogComponent, {
      width: '400px',
      height: '400px',
      data: this.selectedOperator,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.selectedOperator = result
        this.selected.emit(this.selectedOperator);
      }
    });
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}){
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      if(propName==="selectedOperator" && changedProp.currentValue!==undefined){
        console.log(changedProp.currentValue)
        this.mControl.setValue(this.selectedOperator);
      }
      if(propName==="selectedSelectedOperatorId" && changedProp.currentValue!==undefined){

      }
    }
  }

  onFocus(){
    if((this.selectedOperator && this.selectedOperator.name === "") || Object.keys(this.selectedOperator.tech_args).length===0){
      this.trigger._onChange(""); 
      this.trigger.openPanel();
    }else{
      this.openDialog()
    }
  }


  _filter(value:string, list: Array<any>): Array<any>{
    const filterValue = value.toLowerCase();
    return list.filter(option => option[1].toLowerCase().includes(filterValue));
  } 

  displayFn(item: any): string | undefined{
    return item?item.name:undefined
  }

  itemSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedOperator = event.option.value;
    this.selected.emit(event.option.value);
  }

  clearSelection(){
    this.selectedOperator = new TechnicalOperator();
    this.mControl.setValue(null);
    this.selected.emit(this.selectedOperator);
  }
}
