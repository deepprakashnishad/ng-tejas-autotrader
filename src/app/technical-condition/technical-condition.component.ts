import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TechnicalCondition } from './technical-condition';

@Component({
  selector: 'app-technical-condition',
  templateUrl: './technical-condition.component.html',
  styleUrls: ['./technical-condition.component.css']
})
export class TechnicalConditionComponent implements OnInit {

  @Output("technicalCondModified") technicalCondModified = new EventEmitter()
  @Input("technicalCondition")technicalCondition :TechnicalCondition

  constructor() { }

  ngOnInit() {
    if(this.technicalCondition === undefined){
      this.technicalCondition = new TechnicalCondition()
    }
  }

  firstTechnicalSelected(technical){
    if(technical){
      this.technicalCondition.technical1 = technical
      this.conditionModified()
    }
  }

  secondTechnicalSelected(technical){
    if(technical){
      this.technicalCondition.technical2 = technical
      this.conditionModified()
    }
  }

  operatorSelected(operator){
    if(operator){
      this.technicalCondition.operator = operator
      this.conditionModified()
    }
  }

  conditionModified(){
    this.technicalCondModified.emit(this.technicalCondition)
  }
}
