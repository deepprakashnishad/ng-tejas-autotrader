import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { DerivativeAnalysisService } from './derivative-analysis.service';
import { StockSelectionService } from './../stock-selection/stock-selection.service';
import { DerivativeAnalysisResult } from './derivative-analysis-result';
import { FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StockSelectorDialogComponent } from '../stock-selection/stock-selector-dialog/stock-selector-dialog.component';
import { SelectedStock } from '../stock-selection/selected-stock';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-derivative-results',
  templateUrl: './derivative-results.component.html',
  styleUrls: ['./derivative-results.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DerivativeResultsComponent implements OnInit {

  derivativeAnalysisResults: DerivativeAnalysisResult[] = [];
  pageSize=50;
  nifty50stocks = ["HDFCBANK", "RELIANCE", "HDFC", "ICICIBANK", "INFY", "TCS", "KOTAKBANK", "ITC", "AXISBANK", "LT", 
                    "HINDUNILVR", "SBIN", 'BAJFINANCE']
  displayedColumns: string[] = ['stock', 'priority', 'position', 'cpr_width', 'price_change', 'delivery_change', 'coi_change', 
  'net_ce_change', 'net_pe_change', 'pcr_of_change','open', 'high', 'low', 'close', 'star'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  columnsToDisplayControl: FormControl = new FormControl();
  dataSource = new MatTableDataSource<DerivativeAnalysisResult>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  expandedElement: DerivativeAnalysisResult | null;
  favoriteStocks: SelectedStock[] = []

  constructor(
    private derivativeAnalysisService: DerivativeAnalysisService,
    private stockSelectionService: StockSelectionService,
    private notifier: NotifierService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.derivativeAnalysisService.getList().subscribe(response=>{
      this.derivativeAnalysisResults = DerivativeAnalysisResult.listToArray(response['result'])
      this.derivativeAnalysisResults.sort((a,b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0)); 
      this.dataSource.data = this.derivativeAnalysisResults

      this.stockSelectionService.getSelectedStocks(this.derivativeAnalysisResults[0].datetime).subscribe(response=>{
        this.favoriteStocks = SelectedStock.listToArray(response['results'])
      })
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

  openNewTab(url) {
    window.open(url, '_blank');
  }

  compare( a, b ) {
    if ( a.last_nom < b.last_nom ){
      return -1;
    }
    if ( a.last_nom > b.last_nom ){
      return 1;
    }
    return 0;
  }

  getDeliveryColor(price, delivery){
    if(delivery==null)
      return
    if (price > 2 && delivery>125)
      return "green";
    else if(price < -2 && delivery>125)
      return "red";
    else if (price > 2 && delivery<90)
      return "red";
    else if(price < -2 && delivery<90)
      return "green";
  }

  getTooltipContent(row){
    switch(row.position){
      case "Strong Long": return "Very Bullish"
      case "Strong Short": return "Very Bearish"
      case "Long": return "Bullish by options"
      case "Short": return "Bearish by options"
      case "Long Covering": return "Bullish till OI falling"
      case "Short Covering": return "Bearish till OI falling"
      case "New Longs": return "Moderately Bullish & bullish after some volume support"
      case "New Shorts": return "Moderately Bearish & bearish after some volume support"
      case "Long Last Leg": return "Cautiously Bullish"
      case "Short Last Leg": return "Cautiously Bearish"
      case "Weaker Longs": return "Cautiously Bullish"
      case "Weaker Shorts": return "Cautiously Bearish"
      case "Weak Long Covering": return "Moderately Bullish"
      case "Weak Short Covering": return "Moderately Bearish"
      case "No Long Position": return "Bearish"
      case "No Short Position": return "Bullish"
    }
  }

  getPivotTrend(data){
    if(data===null || data['pivot_points']===null)
      return "blue";
    let width = data['pivot_points']['next']['width']
    if (width < 0.4 || width > 1.2){
      if(data['pivot_points']['next']['bc'] >= data['pivot_points']['current']['pivot'])
        return "green"

      else if(data['pivot_points']['next']['tc'] <= data['pivot_points']['current']['pivot'])
        return "red"
      
      else
        return "blue"
    }
  }

  selectedGroupChanged(event){
    let temp;
    if(event.value === "nifty50"){
      temp = this.derivativeAnalysisResults.filter((ele)=>this.nifty50stocks.indexOf(ele.stock)>-1)
    }else if(event.value === "favoriteStocks"){
      temp = this.derivativeAnalysisResults.filter((ele)=>this.getStockIndexInFavorite(ele.stock)>-1)
    }else{
      temp = this.derivativeAnalysisResults
    }
    this.dataSource.data = temp
  }

  toggleSelection(event, ele: DerivativeAnalysisResult){
    let data = {derivativeAnalysisResult: ele}
    if(this.getStockIndexInFavorite(ele.stock) > -1){
      data['favorite'] = this.favoriteStocks[this.getStockIndexInFavorite(ele.stock)]
    }
    const dialogRef = this.dialog.open(StockSelectorDialogComponent,{
      width: "350px",
      data: data
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        if(!result['remove']){
          delete result['remove']
          this.stockSelectionService.addSelectedStock(result).subscribe(response=>{
            console.log(response)
            if(response['updatedExisting']){
              this.favoriteStocks[this.getStockIndexInFavorite(result.stock)] = result
              this.notifier.notify("success", "Stock updated successfully")
            } else{
              result['id'] = response['_id']
              this.favoriteStocks.push(result)
              this.notifier.notify("success", "Stock inserted successfully")
            }
          })
        }else if(result['remove']){
          this.stockSelectionService.deleteSelectedStock(result['_id']).subscribe(response=>{
            console.log(response)
            this.favoriteStocks.splice(this.getStockIndexInFavorite(result.stock), 1)
            this.notifier.notify("success", "Stock removed successfully")
          }) 
        }
      }
    })
  }

  getStockIndexInFavorite(stock){
    for(let i=0; i < this.favoriteStocks.length; i++){
      if(this.favoriteStocks[i]['stock'] == stock)
        return i;
    }
    return -1;
  }
}
