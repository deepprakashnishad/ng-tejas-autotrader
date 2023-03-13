import { Component, OnInit } from '@angular/core';
import { StrategyService } from './strategy.service';
import {Strategy} from './strategy';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material';
import { BacktestDialogComponent } from './backtest-dialog/backtest-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css']
})
export class StrategyComponent implements OnInit {

  strategies: Strategy[]
  deployedStrategyIds: Array<String> = [];

  constructor(
    private strategyService: StrategyService,
    private notifier: NotifierService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe(urlSegments=>{
      if(urlSegments.length>1){
        this.strategyService.getStrategyList(urlSegments[1]['path']).subscribe(result=>{
          this.strategies = result['strategies']
          this.deployedStrategyIds = result['deployed_strategies']
        })
      }else{
        this.strategyService.getStrategyList().subscribe(result=>{
          this.strategies = result['strategies']
          this.deployedStrategyIds = result['deployed_strategies']
        })
      }
    })
    
  }

  onRemove(id, index){
    this.strategyService.delete(id).subscribe(result=>{
      this.strategies.splice(index, 1)
    })
  }

  backtest(strategy){
    var dialogRef = this.dialog.open(BacktestDialogComponent, {
      width: "700px",
      height: "300px",
      data: strategy
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.strategyService.backtest({strategy: strategy, 
          startTime: result['from'], endTime: result['to']}).subscribe(result=>{
            console.log(result)
          })
      }
    })
  }

  isDeployed(strategy){
    return this.deployedStrategyIds.findIndex(ele=>ele===strategy._id)>-1;
  }

  deploy(strategy){
    this.strategyService.deploy([strategy._id]).subscribe(result=>{
      this.deployedStrategyIds.push(strategy._id);
      this.notifier.notify(result['status'], result['msg'])
    });
  }

  finish(strategy){
    var strategyIndex = this.deployedStrategyIds.findIndex(ele=>ele===strategy._id);
    var oldList = this.deployedStrategyIds;
    if(strategyIndex>-1){
      this.deployedStrategyIds.splice(strategyIndex, 1);
    }
    this.strategyService.updateDeployedStrategies(this.deployedStrategyIds).subscribe(result=>{
      if(result['status']==="error"){
        this.deployedStrategyIds= oldList;
      }
      this.notifier.notify(result['status'], result['msg'])
    });
  }
}
