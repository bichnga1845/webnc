import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { IBitcoinPrice } from '../myclass/ibitcoin';

@Injectable({
  providedIn: 'root',
})
export class Bitcoinservices {
//  link api bị chặn nên em bỏ file json để display
  
  private _url: string = "/assets/currentprice.json";

  constructor(private _http: HttpClient) {}

  getBitcoinPrice(): Observable<IBitcoinPrice> {
    return this._http.get<IBitcoinPrice>(this._url).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
