import { Injectable } from '@angular/core';
import {environment} from './../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Technical} from './technical'

@Injectable({
  providedIn: 'root'
})
export class TechnicalService {

  technicalUrl: string

  constructor(
    private http: HttpClient) {
      this.technicalUrl = environment.baseurl + 'technical';
  }

  getList(): Observable<Technical[]>{
    let url = environment.baseurl + 'technicals'
    return this.http.get<Technical[]>(url)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Technical', null)));
  }

  get(id?): Observable<Technical> {
    let url = this.technicalUrl
    if(id){
      url += `?id=${id}`
    }
  	return this.http.get<Technical>(url)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Technical', null)));
  }

  add(technical): Observable<Technical> {
    return this.http.post<Technical>(this.technicalUrl, technical )
    .pipe(
       retry(2),
       catchError(this.handleError('Add Technical', null)));
  }

  update(technical): Observable<Technical> {
    return this.http.put<Technical>(this.technicalUrl, technical)
      .pipe(
        retry(2),
        catchError(this.handleError('Update Technical', null))
      )
  }

  delete(id): Observable<Technical> {
     return this.http.delete<Technical>(this.technicalUrl +'/'+ id)
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
