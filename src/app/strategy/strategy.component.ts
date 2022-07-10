import { Component, OnInit } from '@angular/core';
import { StrategyService } from './strategy.service';
import {Strategy} from './strategy';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material';
import { BacktestDialogComponent } from './backtest-dialog/backtest-dialog.component';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css']
})
export class StrategyComponent implements OnInit {

  strategies: Strategy[]

  constructor(
    private strategyService: StrategyService,
    private notifier: NotifierService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.strategyService.getStrategyList().subscribe(result=>{
      this.strategies = result['strategies']
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

  deploy(strategy){
    this.strategyService.deploy([strategy._id]).subscribe(result=>{
      this.notifier.notify("success", "Strategy deployed successfully")
    });
  }
}
