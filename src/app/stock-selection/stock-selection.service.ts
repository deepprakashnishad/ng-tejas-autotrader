import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockSelectionService {

  stockSelectionUrl: string

  constructor(
    private http: HttpClient) {
      this.stockSelectionUrl = environment.baseurl + 'dailySelection';
  }

  getSelectedStocks(datetime): Observable<any>{
    return this.http.get<any>(this.stockSelectionUrl, {"params": {"datetime": datetime}})
    .pipe(
      retry(2),
      catchError(this.handleError('Get selected stocks', null)));
  }

  deleteSelectedStock(id): Observable<any> {
    return this.http.delete<any>(this.stockSelectionUrl +'/'+ id)
    .pipe(
      retry(2),
      catchError(this.handleError('Remove selected stock', null)));
  }

  addSelectedStock(data): Observable<any> {
    return this.http.put<any>(this.stockSelectionUrl, data)
  .pipe(
      retry(2),
      catchError(this.handleError('Update selected stocks', null)));
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
