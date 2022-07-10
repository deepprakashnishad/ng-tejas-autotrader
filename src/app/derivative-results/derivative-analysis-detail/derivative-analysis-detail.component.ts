import { Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { DerivativeAnalysisService } from '../derivative-analysis.service';
import { DerivativeAnalysisResult } from '../derivative-analysis-result';
import { FormControl } from '@angular/forms';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { KeyValue } from '@angular/common';
import * as zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-derivative-analysis-detail',
  templateUrl: './derivative-analysis-detail.component.html',
  styleUrls: ['./derivative-analysis-detail.component.css']
})
export class DerivativeAnalysisDetailComponent implements OnInit, DoCheck {

  derivativeAnalysisResults: DerivativeAnalysisResult[] = []
  pageSize=15
  stock: string;
  displayedColumns: string[] = ['datetime', 'position', 'price_change', 
  'delivery_change', 'coi_change', 'open', 'high', 'low', 'close'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  columnsToDisplayControl: FormControl = new FormControl();
  dataSource = new MatTableDataSource<DerivativeAnalysisResult>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  lineChartData: ChartDataSets[] = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Prices and COI' },
  ];

  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    pan: {
      enabled: false,
      mode: 'xy',
      rangeMin: {
        // Format of min pan range depends on scale type
        x: null,
        y: null
      },
      rangeMax: {
        // Format of max pan range depends on scale type
        x: null,
        y: null
      },
      // Function called once panning is completed
      // Useful for dynamic data loading
      onPan: function (e) { console.log(`I was panned!!!`, e); }
    },
    zoom: {
      enabled: true,
      drag: false,

      // Drag-to-zoom rectangle style can be customized
      // drag: {
      // 	 borderColor: 'rgba(225,225,225,0.3)'
      // 	 borderWidth: 5,
      // 	 backgroundColor: 'rgb(225,225,225)'
      // },

      // Zooming directions. Remove the appropriate direction to disable
      // Eg. 'y' would only allow zooming in the y direction
      mode: 'x',

      rangeMin: {
        // Format of min zoom range depends on scale type
        x: null,
        y: null
      },
      rangeMax: {
        // Format of max zoom range depends on scale type
        x: null,
        y: null
      },

      // Speed of zoom via mouse wheel
      // (percentage of zoom on a wheel event)
      sensitivity: 0.01,

      // Function called once zooming is completed
      // Useful for dynamic data loading
      onZoom: function ({ chart }) { console.log(`I was zoomed!!!`); }
    },
    scales: {
      yAxes: [{
        id: 'A',
        type: 'linear',
        position: 'left',
      }, {
        id: 'B',
        type: 'linear',
        position: 'right',
        display: false
      }, {
        id: 'C',
        type: 'linear',
        position: 'right',
        display: false
      }]
    },
    annotation: {
      annotations: [
        {
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          value: "MAR",
          borderColor: "red",
          label: {
            content: "TODAY",
            enabled: true,
            position: "top"
          }
        },
         {
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          value: "APR",
          borderColor: "red",
          label: {
            content: "TODAY",
            enabled: true,
            position: "top"
          }
        }
      ]
    }
  };

  lineChartLegend = true;
  lineChartPlugins = [zoomPlugin];
  lineChartType = 'line';

  prices = [];
  dates = [];
  cois = [];
  cois_changes = [];
  pe_changes = [];
  ce_changes = [];
  colors : any = [];

  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        id: 'A',
        type: 'linear',
        position: 'left',
      }]
    }
  };

  stocks = ["NIFTY", "BANKNIFTY", "ACC", "ADANIENT", "ADANIPORTS", "ADANIPOWER", "AMARAJABAT", "AMBUJACEM", "APOLLOHOSP", "APOLLOTYRE",
          "ASHOKLEY", "ASIANPAINT", "AUROPHARMA", "AXISBANK", "BAJAJ-AUTO", "BAJAJFINSV", "BAJFINANCE", "BALKRISIND",
          "BANDHANBNK", "BANKBARODA", "BATAINDIA", "BEL", "BERGEPAINT", "BHARATFORG", "BHARTIARTL", "BHEL", "BIOCON",
          "BOSCHLTD", "BPCL", "BRITANNIA", "CADILAHC", "CANBK", "CENTURYTEX", "CESC", "CHOLAFIN", "CIPLA", "COALINDIA",
          "COLPAL", "CONCOR", "CUMMINSIND", "DABUR", "DIVISLAB", "DLF", "DRREDDY", "EICHERMOT", "EQUITAS", "ESCORTS",
          "EXIDEIND", "FEDERALBNK", "GAIL", "GLENMARK", "GMRINFRA", "GODREJCP", "GODREJPROP", "GRASIM", "HAVELLS",
          "HCLTECH", "HDFC", "HDFCBANK", "HDFCLIFE", "HEROMOTOCO", "HINDALCO", "HINDPETRO", "HINDUNILVR", "IBULHSGFIN",
          "ICICIBANK", "ICICIPRULI", "IDEA", "IDFCFIRSTB", "IGL", "INDIGO", "INDUSINDBK", "INFRATEL", "INFY", "IOC",
          "ITC", "JINDALSTEL", "JSWSTEEL", "JUBLFOOD", "JUSTDIAL", "KOTAKBANK", "L&TFH", "LICHSGFIN", "LT", "LUPIN",
          "M&M", "M&MFIN", "MANAPPURAM", "MARICO", "MARUTI", "MCDOWELL-N", "MFSL", "MGL", "MINDTREE", "MOTHERSUMI",
          "MRF", "MUTHOOTFIN", "NATIONALUM", "NAUKRI", "NCC", "NESTLEIND", "NIITTECH", "NMDC", "NTPC", "ONGC",
          "PAGEIND", "PEL", "PETRONET", "PFC", "PIDILITIND", "PNB", "POWERGRID", "PVR", "RAMCOCEM", "RBLBANK", "RECLTD",
          "RELIANCE", "SAIL", "SBIN", "SHREECEM", "SIEMENS", "SRF", "SRTRANSFIN", "SUNPHARMA", "SUNTV", "TATACHEM",
          "TATACONSUM", "TATAMOTORS", "TATAPOWER", "TATASTEEL", "TCS", "TECHM", "TITAN", "TORNTPHARM", "TORNTPOWER",
          "TVSMOTOR", "UBL", "UJJIVAN", "ULTRACEMCO", "UPL", "VEDL", "VOLTAS", "WIPRO", "YESBANK", "ZEEL"]

  selectedStockIndex: number;

  public barChartData: ChartDataSets[] = [];

  constructor(
    private derivativeAnalysisService: DerivativeAnalysisService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.route.params.subscribe(params => {
      this.stock = params['stock']
      this.refresh(this.stock)
    })
  }

  public ngDoCheck() : void {
	}

  refresh(stock){
    if(this.stocks.indexOf(stock) === -1){
      this.selectedStockIndex = 1;
    }else{
      this.selectedStockIndex = this.stocks.indexOf(stock);
    }

    this.derivativeAnalysisService.get(stock).subscribe(response=>{
      if (response['result'].length > 0) {
        this.derivativeAnalysisResults = DerivativeAnalysisResult.listToArray(response['result'])
        this.dataSource.data = this.derivativeAnalysisResults
        this.derivativeAnalysisResults.reverse()
        this.prices = this.derivativeAnalysisResults.map(ele => ele['close'])
        this.dates = this.derivativeAnalysisResults.map(ele => 
          `${(new Date(ele['datetime'])).getDate()}-${new Date(ele['datetime']).getMonth()+1}`)
        this.cois = this.derivativeAnalysisResults.map(ele => ele['oi_combined'])
        this.pe_changes = this.derivativeAnalysisResults.map(ele => Math.abs(ele['net_pe']))
        this.ce_changes = this.derivativeAnalysisResults.map(ele => Math.abs(ele['net_ce']))

        this.cois_changes = this.derivativeAnalysisResults.map(ele => Math.abs(ele['coi_change']))
        for(let i = 0; i < this.derivativeAnalysisResults.length; i++){
          let colorCode = this.derivativeAnalysisResults[i]['coi_change'] > 0 ? 'rgba(0, 128, 0, 0.6)' : "rgba(255,0,0,0.6)";
          this.colors.push(colorCode);
        }

        this.lineChartData = [
          {data: this.prices, label: `Price`, fill: false, borderColor: 'blue', yAxisID: "A"},
          {data: this.cois, label: `Cummulatice OI`, fill: false, borderColor: 'yellow', yAxisID: "B"},
          {data: this.ce_changes, label: `Net CE`, fill: false, borderColor: 'green', yAxisID: "C", type: "line"},
          {data: this.pe_changes, label: `Net PE`, fill: false, borderColor: 'red', yAxisID: "C", type: "line"},
          // {data: this.cois_changes, label: "OI change", fill: false, backgroundColor: this.colors, yAxisID: "D", type: 'bar'}
        ]
        this.lineChartLabels = this.dates 

        this.barChartData = [
          {data: this.cois_changes, label: "OI change", fill: false, backgroundColor: this.colors, type: 'bar'}
        ]
        this.derivativeAnalysisResults.reverse()
      }else{
        this.derivativeAnalysisResults = []
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

  stockModified(event){
    console.log(event);
    this.refresh(event);
  }

  keyDescOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }

  releaseBodyScroll(){
    document.body.classList.remove("no-scroll");
  }

  trapBodyScroll(){
    document.body.className = "no-scroll";
  }
}
