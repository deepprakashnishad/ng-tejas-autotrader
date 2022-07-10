import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { InstrumentService } from '../instrument.service';
import { Instrument } from '../instrument';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-instrument-selector',
  templateUrl: './instrument-selector.component.html',
  styleUrls: ['./instrument-selector.component.css']
})
export class InstrumentSelectorComponent implements OnInit {

  stocks = ["ACC", "ADANIENT", "ADANIPORTS", "ADANIPOWER", "AMARAJABAT", "AMBUJACEM", "APOLLOHOSP", "APOLLOTYRE",
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

  allInstruments = []
  @Input("instruments") public instruments: Array<Instrument>=[]
  @Output("selectedInstrumentModified") selectedInstrumentModified = new EventEmitter<any>()
  instrumentFilteredList: Observable<any[]>
  instrumentControl=new FormControl()
  @ViewChild(MatAutocompleteTrigger, {static: false}) trigger;

  constructor(private instrumentService: InstrumentService) { }

  ngOnInit() {
    this.instrumentService.getList().subscribe(instruments => this.allInstruments = instruments);
    this.instrumentFilteredList = this.instrumentControl.valueChanges.pipe(
	    startWith(''),
	    map((filterStr: string | null) => {
	      return this._filter(filterStr, this.allInstruments)
		}));
  }

  _filter(value:string, list: Array<any>): Array<any>{
    if(value && typeof value==="string"){
      const filterValue = value.toLowerCase();
        return list.filter(option => (option.tradingsymbol.toLowerCase().includes(filterValue)) && this.instruments.indexOf(option)<0);  
    } else if(list){
      return list.filter(option => this.instruments.indexOf(option)<0);
    }
  } 

  selected(event){
    this.selectedInstrumentModified.emit(event.option.value)
  }

  onFocus(){
		this.trigger._onChange('', this.allInstruments);
		this.trigger.openPanel();
	}
}
