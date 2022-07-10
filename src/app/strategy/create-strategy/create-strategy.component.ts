import { Component, OnInit } from '@angular/core';
import {Strategy} from './../strategy';
import {TechnicalCondition} from './../../technical-condition/technical-condition'
import { StrategyService } from '../strategy.service';
import { Instrument } from 'src/app/instrument/instrument';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-strategy',
  templateUrl: './create-strategy.component.html',
  styleUrls: ['./create-strategy.component.css']
})
export class CreateStrategyComponent implements OnInit {

  panelOpenState = true;
  strategy: Strategy
  instruments: Array<Instrument> = []
  interval: string = "1 Minute"

  constructor(
    private strategyService: StrategyService,
    private notifier: NotifierService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let id = params['id']
      this.strategy = new Strategy()
      if(id){
        this.strategyService.get(id).subscribe(result => {
          if(result){
            this.strategy.fromJson(result['strategy'])
            this.interval = this.strategy.getTimeInterval()
            if(this.route.snapshot.url[1].path==="create"){
              delete this.strategy._id
            }
            console.log(this.strategy)
          }else{
            this.notifier.notify("fail", "Invalid strategy id")
          }
        });  
      }
    })
  }

  addNewEntryCondition(){
    this.strategy.entry_conditions.push(new TechnicalCondition())
  }

  addNewExitCondition(){
    this.strategy.exit_conditions.push(new TechnicalCondition())
  }

  saveStrategy(){
    this.strategy.setTimeframeCompression(this.interval)
    this.strategy.symbols = Instrument.getInstrumentTokenList(this.instruments)
    console.log(this.strategy)
    if (this.strategy._id) {
      this.strategyService.update(this.strategy).subscribe((result)=>{
        this.notifier.notify("success", result['msg'])
      })
    } else {
      this.strategyService.add(this.strategy).subscribe((result)=>{
        this.notifier.notify("success", result['msg'])
      }) 
    }
  }  

  entryConditionModified(index, technicalCondition){
    this.strategy.entry_conditions[index] = technicalCondition
  }

  exitConditionModified(index, technicalCondition){
    this.strategy.exit_conditions[index] = technicalCondition
  }
}
