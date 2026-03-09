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
  private apiUrl = 'http://localhost:4000/api';
  
  constructor(private _http: HttpClient) { }
  
  // Get all fashions
  getFashions():Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/fashions`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // Get fashion by ID
  getFashion(fashionId:string):Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/fashions/${fashionId}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // Get fashions by style
  getFashionsByStyle(style: string): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/fashions/style/${style}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // Create new fashion
  createFashion(fashion: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/fashions`, fashion).pipe(
      catchError(this.handleError)
    );
  }

  // Update fashion
  updateFashion(id: string, fashion: any): Observable<any> {
    return this._http.put<any>(`${this.apiUrl}/fashions/${id}`, fashion).pipe(
      catchError(this.handleError)
    );
  }

  // Delete fashion
  deleteFashion(id: string): Observable<any> {
    return this._http.delete<any>(`${this.apiUrl}/fashions/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error:HttpErrorResponse){
    return throwError(()=>new Error(error.message))
  }
}

