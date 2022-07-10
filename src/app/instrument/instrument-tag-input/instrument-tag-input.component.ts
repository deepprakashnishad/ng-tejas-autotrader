import { Component, OnInit, ViewChild, ElementRef, Inject, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { InstrumentService } from './../instrument.service';
import { Instrument } from '../../instrument/instrument';
import { keyValuesToMap } from '@angular/flex-layout/extended/typings/style/style-transforms';


@Component({
  selector: 'app-instrument-tag-input',
  templateUrl: './instrument-tag-input.component.html',
  styleUrls: ['./instrument-tag-input.component.css']
})
export class InstrumentTagInputComponent implements OnInit {

	@Input("instruments") public instruments: Array<Instrument>=[]
	@Input("instrument_ids") public instrument_ids: Array<number> = []
	@Output("selectedInstrumentModified") selectedInstrumentModified = new EventEmitter<any>()
  	allInstruments: Array<Instrument> = []
  	instrumentFilteredList: Observable<any[]>
	instrumentControl=new FormControl()
	instrument_dict = {
		nifty50: [
			"ADANIPORTS", "ASIANPAINT", "AXISBANK", "BAJAJ-AUTO", "INFRATEL", "ZEEL", "BPCL", "COALINDIA",
			"KOTAKBANK", "HDFC", "ULTRACEMCO", "BRITANNIA", "TECHM", "RELIANCE", "INDUSINDBK", "TCS",
			"BAJAJFINSV", "HINDUNILVR", "SBIN", "BHARTIARTL", "ONGC", "DRREDDY", "SUNPHARMA",
			"WIPRO", "GAIL", "LT", "NTPC", "ICICIBANK", "TITAN", "HEROMOTOCO", "HDFCBANK", "INFY", 
			"NESTLEIND", "HINDALCO", "HCLTECH", "UPL", "ITC", "CIPLA", "JSWSTEEL", "EICHERMOT",
			 "POWERGRID", "VEDL", "IOC", "MARUTI", "TATAMOTORS", "M&M", "TATASTEEL"
		]
	}  
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	  


  	@ViewChild('instrumentInput', {static: false}) instrumentInput: ElementRef<HTMLInputElement>;
    @ViewChild('instrumentAuto', {static: false}) instrumentAuto: MatAutocomplete;
    @ViewChild(MatAutocompleteTrigger, {static: false}) trigger;

  	constructor(
  		private instrumentService: InstrumentService,
  	) { }

  	ngOnInit() {
  		this.instrumentService.getList().subscribe(instruments => this.allInstruments = instruments);
	  	this.instrumentFilteredList = this.instrumentControl.valueChanges.pipe(
	    startWith(''),
	    map((filterStr: string | null) => {
	      return this._filter(filterStr, this.allInstruments)
		}));
	}
	  
	ngOnChanges(changes: SimpleChanges): void {
		for(let k in changes){
			if(k === 'instrument_ids' && changes[k].currentValue.length>0){
				this.instrumentService.getInstrumentByIds(changes[k].currentValue).subscribe(result=>{
					this.instruments = Instrument.getListFromJson(result)
				})
			}
		}
	}

  	_filter(value:string, list: Array<any>): Array<any>{
	    if(value && typeof value==="string"){
	      const filterValue = value.toLowerCase();
	        return list.filter(option => (option.tradingsymbol.toLowerCase().includes(filterValue)) && this.instruments.indexOf(option)<0);  
	    } else if(list){
	      return list.filter(option => this.instruments.indexOf(option)<0);
	    }
	} 

	selected(event: MatAutocompleteSelectedEvent){
		this.instruments.push(event.option.value)
	    this.instrumentControl.setValue(null)
		this.instrumentInput.nativeElement.value=''
		this.selectedInstrumentModified.emit({"instrument": event.option.value, "isAdded": true})
	}

	remove(instrument: Instrument): void {
	    const index = this.instruments.indexOf(instrument);

	    if (index >= 0) {
		  this.instruments.splice(index, 1);
		  this.selectedInstrumentModified.emit({"instrument": instrument, "isAdded": false})
	    }
	}
  
  	onFocus(){
		this.trigger._onChange('', this.allInstruments);
		this.trigger.openPanel();
	}

	addIntruments(type){
		this.instrument_dict[type].forEach(instrument => {
			let item = this._filter(instrument, this.allInstruments)[0]
			if(item){
				this.instruments.push(item)
			}else{
				console.log(instrument)
			}
		});
	}
}
