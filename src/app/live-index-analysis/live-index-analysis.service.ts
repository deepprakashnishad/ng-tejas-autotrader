import { Injectable } from '@angular/core';
import {environment} from './../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LiveIndexAnalysisService {


  liveOptionChainUrl: string

  constructor(
    private http: HttpClient) {
    this.liveOptionChainUrl = environment.baseurl + 'indexOptionChain';
  }

  getOptionChainData(): Observable<any> {
  	return this.http.post<any>(this.liveOptionChainUrl, {})
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Option Chain', null)));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      	console.log(error);
    	if (error instanceof ErrorEvent) {
    		return throwError('Unable to submit request. Please check your internet connection.');
    	} else {
    		return throwError(error);
    	}
    };
  }
}
