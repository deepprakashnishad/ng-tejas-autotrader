import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Screener} from './screener';

@Injectable({
  providedIn: 'root'
})
export class ScreenerService {

  screenerUrl: string

  constructor(
    private http: HttpClient) {
      this.screenerUrl = environment.baseurl + 'screener';
  }

  getScreenerList(): Observable<Screener[]>{
    let url = environment.baseurl + 'screeners'
    return this.http.get<Screener[]>(url)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Screener', null)));
  }

  get(id?): Observable<Screener> {
    let url = this.screenerUrl + "/" + id
    /* if(id){
      url += `?id=${id}`
    } */
  	return this.http.get<Screener>(url)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Screener', null)));
  }

  add(screener): Observable<Screener> {
    return this.http.post<Screener>(this.screenerUrl, screener )
    .pipe(
       retry(2),
       catchError(this.handleError('Add Screener', null)));
  }
  
  deploy(screenerIds): Observable<any> {
    let url = environment.baseurl + `deploy`
    return this.http.post<any>(url, {screener_ids: screenerIds})
    .pipe(
       retry(2),
       catchError(this.handleError('Deploy Screener', null)));
  }

  backtest(data): Observable<any>{
    let url = environment.baseurl + `backtest`
    return this.http.post<any>(url, data)
    .pipe(
       retry(2),
       catchError(this.handleError('Backtest Screener', null)));
  }

  update(screener): Observable<Screener> {
    return this.http.put<Screener>(this.screenerUrl+"/"+screener._id, screener)
      .pipe(
        retry(2),
        catchError(this.handleError('Update Screener', null))
      )
  }

  delete(boardId): Observable<Screener> {
     return this.http.delete<Screener>(this.screenerUrl +'/'+ boardId)
    .pipe(
       retry(2),
       catchError(this.handleError('Delete Screener', null)));
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
