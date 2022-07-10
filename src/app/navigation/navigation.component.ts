import { Component, Input, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  isLoggedIn: boolean  = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router
  ) {}

	ngOnInit() {
  }  

  logout(){
    
  }

  navigate(url){
    this.zone.run(()=>{
      this.router.navigate([url]);
    });
  }
}
