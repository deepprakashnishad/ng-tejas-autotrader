import { Component, OnInit } from '@angular/core';

import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-kite-authentication',
  template: 'You will be redirected to home page',
  styleUrls: []
})
export class KiteAuthenticationComponent implements OnInit {

	constructor(
	    private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params=>{
            if(params['status']==="success"){
                this.authenticationService.getAccessKiteToken(params['request_token']);
            }
        });
    }
}
