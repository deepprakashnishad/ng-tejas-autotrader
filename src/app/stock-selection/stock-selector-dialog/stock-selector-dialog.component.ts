import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TechnicalDetailDialogComponent } from 'src/app/technical/technical-detail-dialog/technical-detail-dialog.component';

@Component({
  selector: 'app-stock-selector-dialog',
  templateUrl: './stock-selector-dialog.component.html',
  styleUrls: ['./stock-selector-dialog.component.css']
})
export class StockSelectorDialogComponent implements OnInit {

  transactionType: string="BUY";
  entryPrice: number = 0.0;
  stoploss: number = 0.0;
  target: number = 0.0;
  quantity = 0;
  _id: string;
  risk_per_trade = 2000
  risk_reward_ratio = 1
  stock: string;
  datetime: string;

  constructor(
    public dialogRef: MatDialogRef<TechnicalDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if(this.data['favorite']){
      this._id = this.data['favorite']['id'];
      this.transactionType = this.data['favorite']['transactionType'];
      this.entryPrice = this.data['favorite']['entryPrice'];
      this.stoploss = this.data['favorite']['stoploss'];
      this.target = this.data['favorite']['target'];
      this.quantity = this.data['favorite']['quantity'];
      this.risk_per_trade = this.data['favorite']['risk_per_trade'];
      this.risk_reward_ratio = this.data['favorite']['risk_reward_ratio'];
      this._id = this.data['favorite']['id']
      this.stock = this.data['favorite']['stock']
      this.datetime = this.data['derivativeAnalysisResult']['datetime']
    }else{
      this.datetime = this.data['derivativeAnalysisResult']['datetime']
      this.data = this.data['derivativeAnalysisResult']
      this.initializeData()
    }
  }

  initializeData(){
    this.entryPrice = this.data['pivot_points']['next']['pivot']
    if(this.data.position.includes("Long")){
      this.transactionType = "BUY"
      if(this.data['pivot_points']['next']['s1'] === this.entryPrice){
          this.stoploss = (this.entryPrice - 3*this.entryPrice/100)
        }
      else{
        this.stoploss = this.data['pivot_points']['next']['s1']
      }

      if(this.data['cpr_width'] > 0.6)
        this.target = this.data['pivot_points']['next']['r2']
      else{
        this.target = this.data['pivot_points']['next']['r3']
      }
    }else if(this.data.position.includes("Short")){
      this.transactionType = "SELL"
      if(this.data['pivot_points']['next']['s1'] === this.entryPrice){
        this.stoploss = (this.entryPrice + 3*this.entryPrice/100)
      }
      else{
        this.stoploss = this.data['pivot_points']['next']['r1']
      }

      if(this.data['cpr_width'] > 0.6)
        this.target = this.data['pivot_points']['next']['s2']
      else{
        this.target = this.data['pivot_points']['next']['s3']
      }
    }
    this.stock = this.data['stock']
    this.calcQtyAndRatio();
  }

  calcQtyAndRatio(){
    let loss, profit;
    if(this.transactionType === "BUY"){
      loss = this.entryPrice - this.stoploss  
      profit = this.target - this.entryPrice
    }else{
      loss = this.stoploss - this.entryPrice
      profit = this.entryPrice - this.target  
    }
    if(loss > 0 && profit > 0){
      this.risk_reward_ratio = loss/profit
      this.quantity = Math.floor(this.risk_per_trade/loss)
    }else{
      this.risk_reward_ratio = 999
      this.quantity = 0
    }
  }

  done(){
    let result = {
      "remove": false,
      "transactionType": this.transactionType,
      "entryPrice": this.entryPrice,
      "stoploss": this.stoploss,
      "target": this.target,
      "quantity": this.quantity,
      "risk_per_trade": this.risk_per_trade,
      "risk_reward_ratio": this.risk_reward_ratio,
      "stock": this.stock,
      "datetime": this.datetime
    }
    this.dialogRef.close(result);
  }

  remove(){
    this.dialogRef.close({_id: this._id, remove: true, stock: this.stock})
  }
}
