import { Component, Input, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  isLoggedIn: boolean  = false;
  name: string="";

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {}

	ngOnInit() {
    this.authenticationService.isLoggedIn.subscribe(value => {
        this.isLoggedIn = value;
        if(value){
          this.name = this.authenticationService.getTokenOrOtherStoredData("name");
        }
    });
  }  

  logout(){
    this.authenticationService.logout();
  }

  navigate(url){
    this.zone.run(()=>{
      this.router.navigate([url]);
    });
  }
}
