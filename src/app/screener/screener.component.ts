import { Component, OnInit } from '@angular/core';
import { ScreenerService } from './screener.service';
import {Screener} from './screener';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-screener',
  templateUrl: './screener.component.html',
  styleUrls: ['./screener.component.css']
})
export class ScreenerComponent implements OnInit {

  screeners: Screener[] = []

  constructor(
    private screenerService: ScreenerService,
    private notifier: NotifierService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.screenerService.getScreenerList().subscribe(result=>{
      this.screeners = result['screeners']
    })
  }

  onRemove(id, index){
    this.screenerService.delete(id).subscribe(result=>{
      this.screeners.splice(index, 1)
    })
  }

  deploy(screener){
    this.screenerService.deploy([screener._id]).subscribe(result=>{
      this.notifier.notify("success", "Screener deployed successfully")
    });
  }
}
