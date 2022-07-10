import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { KeyValue } from '@angular/common';
import { StockSelectionService } from './stock-selection.service';
import { SelectedStock } from './selected-stock';

@Component({
  selector: 'app-stock-selection',
  templateUrl: './stock-selection.component.html',
  styleUrls: ['./stock-selection.component.css']
})
export class StockSelectionComponent implements OnInit {

  stockSelectionResults: SelectedStock[] = []
  pageSize=15
  stock: string;
  displayedColumns: string[] = ['stock', 'transactionType', 'entryPrice', 'risk_per_trade',
                                'stoploss', 'target', 'quantity', 'risk_reward_ratio'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  columnsToDisplayControl: FormControl = new FormControl();
  dataSource = new MatTableDataSource<SelectedStock>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  selectedStockIndex: number;
  selectedDate = new Date()

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


  constructor(
    private stockSelectionService: StockSelectionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.route.params.subscribe(params => {
      this.stock = params['stock']
      this.changeSelectedDate(-2)
      this.refresh(this.selectedDate)
    })
  }

  dateToString(date: Date){
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 00:00:00`
  }

  refresh(datetime){
    datetime = this.dateToString(datetime)
    this.stockSelectionService.getSelectedStocks(datetime).subscribe(response=>{
      if (response['results'].length > 0) {
        this.stockSelectionResults = SelectedStock.listToArray(response['results'])
        this.dataSource.data = this.stockSelectionResults
      }else{
        this.stockSelectionResults = []
      }
    }, err=>{
      console.log(err)
    })
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  displayedColumnModified(event){
    this.columnsToDisplay = event.value
  }

  changeSelectedDate(changeFactor){
    this.selectedDate.setDate(this.selectedDate.getDate() + changeFactor)
    this.refresh(this.selectedDate)
  }

  keyDescOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }

  calcQtyAndRatio(fieldname, index){
    let loss, profit;
    let data = this.stockSelectionResults[index]

    switch(fieldname){
      case "entryPrice": data['entryPrice'] = this.dataSource.data[index][fieldname]
        break;
      case "stoploss": data['stoploss'] = this.dataSource.data[index][fieldname]
        break;
      case "target": data['target'] = this.dataSource.data[index][fieldname]
        break;
      case "risk_per_trade": data['risk_per_trade'] = this.dataSource.data[index][fieldname]
        break;
      case "transactionType": data['transactionType'] = this.dataSource.data[index][fieldname]
        break;
    }

    if(data.transactionType === "BUY"){
      loss = data.entryPrice - data.stoploss  
      profit = data.target - data.entryPrice
    }else{
      loss = data.stoploss - data.entryPrice
      profit = data.entryPrice - data.target  
    }
    if(loss > 0 && profit > 0){
      data.risk_reward_ratio = loss/profit
      data.quantity = Math.floor(data.risk_per_trade/loss)
    }else{
      data.risk_reward_ratio = 999
      data.quantity = 0
    }
    this.dataSource.data[index] = data
  }
}
