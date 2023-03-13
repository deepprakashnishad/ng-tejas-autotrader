import { Component, OnInit, ViewChild } from '@angular/core';
import { LiveIndexAnalysisService} from './live-index-analysis.service';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label, BaseChartDirective } from 'ng2-charts';
import {MatTableDataSource} from '@angular/material/table';
import * as zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'live-index-analysis',
  templateUrl: './live-index-analysis.component.html',
  styleUrls: ['./live-index-analysis.component.css']
})
export class LiveIndexAnalysisComponent implements OnInit {

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
      enabled: false,
      drag: false,

      // Drag-to-zoom rectangle style can be customized
      // drag: {
      //   borderColor: 'rgba(225,225,225,0.3)'
      //   borderWidth: 5,
      //   backgroundColor: 'rgb(225,225,225)'
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
        position: 'right'
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

   @ViewChild(BaseChartDirective, {static: true}) chart?: BaseChartDirective;

  lineChartLegend = true;
  lineChartPlugins = [zoomPlugin];
  lineChartType = 'line';

  net_oi_change_nifty = [];
  net_oi_change_banknifty = [];
  pcr_nifty = [];
  pcr_banknifty = [];
  dates = [];
  colors : any = [];

  selectedTimeframe = 5;

  nifty_max_pain_ce = {}
  nifty_max_pain_pe = {}
  banknifty_max_pain_ce = {}
  banknifty_max_pain_pe = {}

  displayedColumns: string[] = ['datetime', 'net_pe_change', 'net_ce_change', 'net_change', 'pcr', 'avg_max_pain_ce', 'avg_max_pain_pe'];
  dataSourceNifty = new MatTableDataSource<any>();
  dataSourceBankNifty = new MatTableDataSource<any>();

  detailDataArr: any = [];

  constructor(
    private liveIndexAnalysisService: LiveIndexAnalysisService
  ) { }

  ngOnInit() {
    this.getOptionChainData();
    setInterval(()=>this.getOptionChainData(), 60000)
  }

  getOptionChainData(){
    this.refresh();
    /*this.liveIndexAnalysisService.getOptionChainData().subscribe(result=>{
      localStorage.setItem("optionChainData", JSON.stringify(result))
      this.refresh()
    })*/
  }

  refresh(){
    var optionChainData = JSON.parse(localStorage.getItem("optionChainData"));


    // this.net_oi_change_nifty = optionChainData['nifty'].map(ele => ele['net_change'])
    // this.pcr_nifty = optionChainData['nifty'].map(ele => ele['pcr'])
    this.nifty_max_pain_ce = optionChainData['nifty'][optionChainData['nifty'].length-1]["max_pain_ce"]
    this.nifty_max_pain_pe = optionChainData['nifty'][optionChainData['nifty'].length-1]["max_pain_pe"]

    // this.net_oi_change_banknifty = optionChainData['banknifty'].map(ele => ele['net_change'])
    // this.pcr_banknifty = optionChainData['banknifty'].map(ele => ele['pcr'])
    this.banknifty_max_pain_ce = optionChainData['banknifty'][optionChainData['banknifty'].length-1]["max_pain_ce"]
    this.banknifty_max_pain_pe = optionChainData['banknifty'][optionChainData['banknifty'].length-1]["max_pain_pe"]
    this.prepareSeries();
  }

  cleanChart(){
    this.lineChartData = [];
    this.lineChartLabels = [];
    this.dates = [];
    this.detailDataArr = {'nifty':[],'banknifty':[]};
    this.chart.update()
  }

  getMaxPainAverage(dataSet){
    var totalWorth: number = 0;
    var totalContract: number = 0;
    for(var key in dataSet){
      totalWorth = totalWorth + (parseInt(key)*parseInt(dataSet[key]));
      totalContract = totalContract + parseInt(dataSet[key]);
    }
    if(totalContract===0)
      return 0;

    return (totalWorth/totalContract);
  }

  prepareSeries(){
    this.cleanChart();
    var optionChainData = JSON.parse(localStorage.getItem("optionChainData"));

    for(var i=0;i<optionChainData['nifty'].length;){
      if(i===0){
        this.net_oi_change_nifty.push(optionChainData['nifty'][i]['net_change']) 
        this.pcr_nifty.push(optionChainData['nifty'][i]['pcr'])
      }
      var nextIndex = this.getNextData(optionChainData['nifty'][i], i, optionChainData['nifty']);
      var nextData = optionChainData['nifty'][nextIndex];

      nextData['avg_max_pain_ce'] = this.getMaxPainAverage(nextData['max_pain_ce']);
      nextData['avg_max_pain_pe'] = this.getMaxPainAverage(nextData['max_pain_pe']);

      this.detailDataArr['nifty'].push(nextData);

      this.net_oi_change_nifty.push(nextData['net_change']) 
      this.pcr_nifty.push(nextData['pcr'])
      var temp = nextData['datetime'].split(" ")[1].split(":");
      this.dates.push(`${temp[0]}:${temp[1]}`);
      if(nextIndex>i){
        i=nextIndex;  
      }else{
        i++;
      }
    }

    this.dataSourceNifty.data = this.detailDataArr['nifty']
    console.log(this.dataSourceNifty);

    for(var i=0;i<optionChainData['banknifty'].length;){
      if(i===0){
        this.net_oi_change_nifty.push(optionChainData['banknifty'][i]['net_change']) 
        this.pcr_nifty.push(optionChainData['banknifty'][i]['pcr'])
      }
      var nextIndex = this.getNextData(optionChainData['banknifty'][i], i, optionChainData['banknifty']);
      var nextData = optionChainData['banknifty'][nextIndex];

      nextData['avg_max_pain_ce'] = this.getMaxPainAverage(nextData['max_pain_ce']);
      nextData['avg_max_pain_pe'] = this.getMaxPainAverage(nextData['max_pain_pe']);

      this.detailDataArr['banknifty'].push(nextData);

      this.net_oi_change_banknifty.push(nextData['net_change']) 
      this.pcr_banknifty.push(nextData['pcr'])
      if(nextIndex>i){
        i=nextIndex;  
      }else{
        i++;
      }      
    }  

    this.dataSourceBankNifty = this.detailDataArr['banknifty']
    this.lineChartData = [
      {data: this.net_oi_change_nifty, label: `Net OI Change Nifty`, fill: false, borderColor: 'blue', yAxisID: "A"},
      {data: this.net_oi_change_banknifty, label: `Net OI Change Banknifty`, fill: false, borderColor: 'pink', yAxisID: "B"},
      {data: this.pcr_nifty, label: `Nifty PCR`, fill: false, borderColor: 'lightblue', yAxisID: "C", hidden: true},
      {data: this.pcr_banknifty, label: `Banknifty PCR`, fill: false, borderColor: 'yellow', yAxisID: "C", hidden: true},
    ]
    this.lineChartLabels = this.dates;

    this.chart.update();
  }

  timeframeUpdated(){
    this.refresh();
  }

  getNextData(currData, currIndex, optionChainData){
    var currTime = currData['datetime'].split(" ")[1].split(":");
    var selectedNextTime = this.getNextTime(parseInt(currTime[0]), parseInt(currTime[1]));

    var nextIndex = currIndex + (this.selectedTimeframe-1);
    
    while(true){
      if(nextIndex < optionChainData.length){
        var nextTime = optionChainData[nextIndex]['datetime'].split(" ")[1].split(":");
      }else{
        var nextTime = optionChainData[optionChainData.length-1]['datetime'].split(" ")[1].split(":");
        nextIndex=optionChainData.length-1;
      }
      
      if(new Date(`1/1/1960 ${nextTime[0]}:${nextTime[1]}`) <= new Date(`1/1/1960 ${selectedNextTime['nextHour']}:${selectedNextTime['nextMin']}`)){
        return nextIndex;
      }
      nextIndex--;
    }
  }

  getNextTime(currentHour, currMin){
    var nextMin = currMin + this.selectedTimeframe;

    if(nextMin > 59){
      var nextHour = currentHour + 1;
      nextMin = nextMin - 60;
    }else{
      var nextHour = currentHour;
    }

    return {"nextHour": nextHour, "nextMin": nextMin};
  }
}
