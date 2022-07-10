import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Technical } from './../technical'
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-technical-detail-dialog',
  templateUrl: './technical-detail-dialog.component.html',
  styleUrls: ['./technical-detail-dialog.component.css']
})
export class TechnicalDetailDialogComponent implements OnInit {

  mPeriodControl = new FormControl('')
  mOffsetControl = new FormControl('')
  mFieldControl = new FormControl('')
  mTypeControl = new FormControl('')
  mValueControl = new FormControl('')
  techargs = []

  constructor(
    public dialogRef: MatDialogRef<TechnicalDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public technical: any
  ) { 
    this.techargs = Object.keys(technical.tech_args)
  }

  ngOnInit() {
  }
}
