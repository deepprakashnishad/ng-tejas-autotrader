import { Component, OnInit, Inject, Input } from '@angular/core';
import { Strategy } from '../strategy';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Form } from '@angular/forms';

@Component({
  selector: 'app-backtest-dialog',
  templateUrl: './backtest-dialog.component.html',
  styleUrls: ['./backtest-dialog.component.css']
})
export class BacktestDialogComponent implements OnInit {

  toDateTime: Date
  fromDateTime: Date
  public selectedMoments = [new Date(), new Date()];
  // fromDateControl: FormControl = new FormControl()
  // toDateControl: FormControl = new FormControl()

  constructor(
    public dialogRef: MatDialogRef<BacktestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public strategy: Strategy
  ) { 
    this.toDateTime = new Date()
    this.fromDateTime = new Date()
    let month = this.toDateTime.getMonth()
    if(month==0){
      this.fromDateTime.setMonth(12)
      this.fromDateTime.setFullYear(this.toDateTime.getFullYear())
    }else{
      this.fromDateTime.setMonth(month-1)
    }
    this.selectedMoments[0] = this.fromDateTime;
    this.selectedMoments[1] = this.toDateTime;
  }

  ngOnInit() {
  }

  done(){
    this.dialogRef.close({from: this.selectedMoments[0], to: this.selectedMoments[1]})
  }

  cancel(){
    this.dialogRef.close()
  }
}
