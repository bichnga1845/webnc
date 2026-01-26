import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ICryptocurrency } from '../myclass/ibitcoin';

@Injectable({
  providedIn: 'root',
})
export class Bitcoinservices {
  // Link API cryptocurrency prices (through proxy)
  private _url: string = "/ticker/";
  
  // Direct API (CORS blocked)
  // private _url: string = "https://api.alternative.me/v1/ticker/";

  constructor(private _http: HttpClient) {}

  getCryptoPrice(): Observable<ICryptocurrency[]> {
    return this._http.get<ICryptocurrency[]>(this._url).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
