import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import {Observable, of, throwError} from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { retry, catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationService {

    isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    redirectUrl: string;

    constructor(
        private http: HttpClient,
        private notifier: NotifierService,
        private router: Router
    ) { 
        if(this.getTokenOrOtherStoredData("isLoggedIn")){
          this.isLoggedIn.next(true);
        }
    }

    getAccessKiteToken(requestToken){
        this.http.get(`${environment.baseurl}authentication?request_token=${requestToken}`).subscribe(result=>{
            console.log(result);
            if(result['status']){
                this.notifier.notify("success", result['msg']);
                this.storeLocalData(result, "SESSION_STORAGE");
                this.router.navigate(['']);
            }else{
                this.notifier.notify("error", result['msg']);
                this.router.navigate(["login"]);
            }
        });
    }

    authorizeUser(accessListReqd: string[]):boolean{
      if (this.getTokenOrOtherStoredData()){
        if(accessListReqd===undefined || accessListReqd.length == 0){
          return true;
        }
        let permissionList:string = this.getTokenOrOtherStoredData('permissions')
        if(permissionList === undefined){
          return false;
        }

        let allowedPermissionList = permissionList.split(',')
          return accessListReqd.every((ele)=> 
          {  
            return allowedPermissionList.indexOf(ele) >=0 
          }
        )
      }else{
        return false;
      }
      
  }

  getTokenOrOtherStoredData(key='token') {
    if (sessionStorage.getItem(key)) {
      return sessionStorage.getItem(key);
    } else if (localStorage.getItem(key)) {
      return localStorage.getItem(key);
    } else {
      return '';
    }
  }

  logout(): void{
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
    this.isLoggedIn.next(false);
  }

  storeLocalData(data: any, storageType="SESSION_STORAGE"): void {
    if (storageType === "LOCAL_STORAGE") {
      localStorage.setItem('token', data.auth_token, );
      localStorage.setItem('userdata', data.userdata);
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      sessionStorage.setItem('token', data.auth_token, );
      sessionStorage.setItem('userdata', JSON.stringify(data.userdata));
      sessionStorage.setItem('isLoggedIn', 'true');
    }
    this.isLoggedIn.next(true);
  }

  patchStoredData(data: any):void{
    Object.keys(data).forEach((key)=>{
      if(localStorage.getItem(key)){
        localStorage.setItem(key, data[key]);
      }
      if(sessionStorage.getItem(key)){
        sessionStorage.setItem(key, data[key]);
      }
    });
  }

   /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      if(error instanceof HttpErrorResponse && error.status === 403){
        this.redirectUrl = this.router.url
        this.router.navigate(['/login', {'error':[error.error.msg]}])
        localStorage.clear();
        sessionStorage.clear();
        this.isLoggedIn.next(false);
      }else if(error instanceof HttpErrorResponse && error.status === 500){
        this.notifier.notify("error", error.error.msg);
        this.notifier.notify("error", "Server error. Please contact developer");
        return throwError(error);
      }else if (error instanceof ErrorEvent) {
            return throwError('Unable to submit request. Please check your internet connection.');
        } else {
            return throwError(error);
        }
    };
  }
}
