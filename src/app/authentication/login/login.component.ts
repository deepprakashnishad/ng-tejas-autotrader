import { Component, OnInit } from '@angular/core';

import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	constructor(
	    private notifier: NotifierService,
	    private router: Router,
      private authenticationService: AuthenticationService,
	    public dialog: MatDialog
    ) { }

    ngOnInit() {
    }

    signIn(client){
      if(client==="Zerodha"){

        // this.authenticationService.getAccessKiteToken("DUMMY_REQUEST_TOKEN");
        
        var zerodhaUrl = "https://kite.zerodha.com/connect/login?v=3&api_key="+environment.zerodha.api_key;
        window.location.href = zerodhaUrl;
      }
    }
}
