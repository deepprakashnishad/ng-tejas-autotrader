import { Injectable } from '@angular/core';
import {environment} from './../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Strategy} from './strategy';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  strategyUrl: string

  constructor(
    private http: HttpClient) {
      this.strategyUrl = environment.baseurl + 'strategy';
  }

  getStrategyList(): Observable<Strategy[]>{
    let url = environment.baseurl + 'strategies'
    return this.http.get<Strategy[]>(url)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Strategy', null)));
  }

  get(id?): Observable<Strategy> {
    let url = this.strategyUrl + "/" + id
    /* if(id){
      url += `?id=${id}`
    } */
  	return this.http.get<Strategy>(url)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Strategy', null)));
  }

  add(strategy): Observable<Strategy> {
    return this.http.post<Strategy>(this.strategyUrl, strategy )
    .pipe(
       retry(2),
       catchError(this.handleError('Add Strategy', null)));
  }
  
  deploy(strategyIds): Observable<any> {
    let url = environment.baseurl + `deploy`
    return this.http.post<any>(url, {strategy_ids: strategyIds})
    .pipe(
       retry(2),
       catchError(this.handleError('Deploy Strategy', null)));
  }

  backtest(data): Observable<any>{
    let url = environment.baseurl + `backtest`
    return this.http.post<any>(url, data)
    .pipe(
       retry(2),
       catchError(this.handleError('Backtest Strategy', null)));
  }

  update(strategy): Observable<Strategy> {
    return this.http.put<Strategy>(this.strategyUrl+"/"+strategy._id, strategy)
      .pipe(
        retry(2),
        catchError(this.handleError('Update Strategy', null))
      )
  }

  delete(boardId): Observable<Strategy> {
     return this.http.delete<Strategy>(this.strategyUrl +'/'+ boardId)
    .pipe(
       retry(2),
       catchError(this.handleError('Delete Strategy', null)));
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
