import { Injectable } from '@angular/core';
import {environment} from './../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {TechnicalOperator} from './technical-operator'

@Injectable({
  providedIn: 'root'
})
export class TechnicalOperatorService {

  operatorUrl: string

  constructor(
    private http: HttpClient) {
      this.operatorUrl = environment.baseurl + 'operator';
  }

  getList(): Observable<TechnicalOperator[]>{
    let url = environment.baseurl + 'operators'
    return this.http.get<TechnicalOperator[]>(url)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Technical', null)));
  }

  get(id?): Observable<TechnicalOperator> {
    let url = this.operatorUrl
    if(id){
      url += `?id=${id}`
    }
  	return this.http.get<TechnicalOperator>(url)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Technical', null)));
  }

  add(technical): Observable<TechnicalOperator> {
    return this.http.post<TechnicalOperator>(this.operatorUrl, technical )
    .pipe(
       retry(2),
       catchError(this.handleError('Add Technical', null)));
  }

  update(technical): Observable<TechnicalOperator> {
    return this.http.put<TechnicalOperator>(this.operatorUrl, technical)
      .pipe(
        retry(2),
        catchError(this.handleError('Update Technical', null))
      )
  }

  delete(id): Observable<TechnicalOperator> {
     return this.http.delete<TechnicalOperator>(this.operatorUrl +'/'+ id)
    .pipe(
       retry(2),
       catchError(this.handleError('Delete Technical', null)));
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
