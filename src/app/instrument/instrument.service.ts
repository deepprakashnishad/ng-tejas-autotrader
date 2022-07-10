import { Injectable } from '@angular/core';
import {environment} from './../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Instrument} from './instrument';

@Injectable({
  providedIn: 'root'
})
export class InstrumentService {


  instrumentUrl: string

  constructor(
    private http: HttpClient) {
      this.instrumentUrl = environment.baseurl + 'instrument';
  }

  getList(): Observable<Instrument[]>{
    let url = environment.baseurl + 'instruments'
    return this.http.get<Instrument[]>(url)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Instrument List', null)));
  }

  get(id?): Observable<Instrument> {
    let url = this.instrumentUrl
    if(id){
      url += `?id=${id}`
    }
  	return this.http.get<Instrument>(url)
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Instrument', null)));
  }

  getInstrumentByIds(ids): Observable<Instrument[]>{
    let url = environment.baseurl + 'instruments'
    return this.http.post<Instrument[]>(url, {ids: ids})
  		.pipe(
  			retry(2),
  			catchError(this.handleError('Get Instrument List', null)));
  }

  add(instrument): Observable<Instrument> {
    return this.http.post<Instrument>(this.instrumentUrl, instrument )
    .pipe(
       retry(2),
       catchError(this.handleError('Add Instrument', null)));
  }

  update(instrument): Observable<Instrument> {
    return this.http.put<Instrument>(this.instrumentUrl, instrument)
      .pipe(
        retry(2),
        catchError(this.handleError('Update Instrument', null))
      )
  }

  delete(boardId): Observable<Instrument> {
     return this.http.delete<Instrument>(this.instrumentUrl +'/'+ boardId)
    .pipe(
       retry(2),
       catchError(this.handleError('Delete Instrument', null)));
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
