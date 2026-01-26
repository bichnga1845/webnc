import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFakeProduct } from '../myclass/iProducts';
import { map } from 'rxjs/internal/operators/map';
import { retry } from 'rxjs/internal/operators/retry';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root',
})
export class FakeProductService {

  private _url:string="/products"
  constructor(private _http: HttpClient) { } // neeus thi giua ki thi phai vo app model de impoer httpclient
  getFakeProductData():Observable<any> {
    const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
    headers:headers,
    responseType:"text"
  }
    return this._http.get<any>(this._url,requestOptions).pipe(
    map(res=>JSON.parse(res) as Array<IFakeProduct>),
    retry(3),
    catchError(this.handleError))
  }
    handleError(error:HttpErrorResponse){
    return throwError(()=>new Error(error.message))
  }
}
