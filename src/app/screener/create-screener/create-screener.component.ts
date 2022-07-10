import { Component, OnInit } from '@angular/core';
import {Screener} from './../screener';
import {TechnicalCondition} from './../../technical-condition/technical-condition'
import { ScreenerService } from '../screener.service';
import { Instrument } from 'src/app/instrument/instrument';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-screener',
  templateUrl: './create-screener.component.html',
  styleUrls: ['./create-screener.component.css']
})
export class CreateScreenerComponent implements OnInit {

  panelOpenState = true;
  screener: Screener
  instruments: Array<Instrument> = []
  interval: string = "1 Minute"

  constructor(
    private screenerService: ScreenerService,
    private notifier: NotifierService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let id = params['screener_id']
      this.screener = new Screener()
      if(id){
        this.screenerService.get(id).subscribe(result => {
          if(result){
            this.screener.fromJson(result['screener'])
            this.interval = this.screener.getTimeInterval()
            if(this.route.snapshot.url[1].path==="create"){
              delete this.screener._id
            }
            console.log(this.screener)
          }else{
            this.notifier.notify("fail", "Invalid screener id")
          }
        });  
      }
    })
  }

  addNewEntryCondition(){
    this.screener.entry_conditions.push(new TechnicalCondition())
  }

  saveScreener(){
    this.screener.setTimeframeCompression(this.interval)
    console.log(this.screener)
    if (this.screener._id) {
      this.screenerService.update(this.screener).subscribe((result)=>{
        this.notifier.notify("success", result['msg'])
      })
    } else {
      this.screenerService.add(this.screener).subscribe((result)=>{
        this.notifier.notify("success", result['msg'])
      }) 
    }
  }  

  entryConditionModified(index, technicalCondition){
    this.screener.entry_conditions[index] = technicalCondition
  }
}
