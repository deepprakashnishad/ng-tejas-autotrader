import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { DerivativeAnalysisResult } from './derivative-analysis-result';

@Injectable({
  providedIn: 'root'
})
export class DerivativeAnalysisService {

  derivativeAnalysisResultUrl: string

  constructor(
    private http: HttpClient) {
      this.derivativeAnalysisResultUrl = environment.baseurl + 'derivativeAnalysisResult';
  }

  getList(): Observable<DerivativeAnalysisResult[]>{
    return this.http.get<DerivativeAnalysisResult[]>(this.derivativeAnalysisResultUrl)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get DerivativeAnalysisResult', null)));
  }

  get(stock): Observable<DerivativeAnalysisResult> {
    let url = environment.baseurl + `detailDerivativeAnalysisResult/${stock}`
  	return this.http.get<DerivativeAnalysisResult>(url)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get DerivativeAnalysisResult', null)));
  }

  add(derivativeAnalysisResult): Observable<DerivativeAnalysisResult> {
    return this.http.post<DerivativeAnalysisResult>(this.derivativeAnalysisResultUrl, derivativeAnalysisResult )
    .pipe(
       retry(2),
       catchError(this.handleError('Add DerivativeAnalysisResult', null)));
  }

  update(derivativeAnalysisResult): Observable<DerivativeAnalysisResult> {
    return this.http.put<DerivativeAnalysisResult>(this.derivativeAnalysisResultUrl, derivativeAnalysisResult)
      .pipe(
        retry(2),
        catchError(this.handleError('Update DerivativeAnalysisResult', null))
      )
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
