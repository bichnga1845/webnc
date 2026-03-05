import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { retry } from 'rxjs/internal/operators/retry';
import { Fashion } from '../myclass/Fashion';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class FashionAPIService {
  constructor(private _http: HttpClient) { }
  getFashions():Observable<any>
  {
  const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
  const requestOptions:Object={
  headers:headers,
  responseType:"text"
  }
  return this._http.get<any>("http://localhost:3002/fashions",requestOptions).pipe(
  map(res=>JSON.parse(res) as Array<Fashion>),
  retry(3),
  catchError(this.handleError))
  }

  getFashion(fashionId:string):Observable<any>
  {
  const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
  const requestOptions:Object={
  headers:headers,
  responseType:"text"
  }
  return this._http.get<any>("http://localhost:3002/fashions/"+fashionId,requestOptions).pipe(
  map(res=>{
    console.log('Raw response:', res);
    const parsed = JSON.parse(res) as Fashion;
    console.log('Parsed response:', parsed);
    return parsed;
  }),
  retry(3),
  catchError(this.handleError))
  }

  handleError(error:HttpErrorResponse){
  return throwError(()=>new Error(error.message))
  }
}

