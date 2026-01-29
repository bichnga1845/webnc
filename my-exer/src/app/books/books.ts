import { Component } from '@angular/core';
import { BookAPIservices } from '../myservices/book-apiservices';

@Component({
  selector: 'app-books',
  standalone: false,
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books {
  books:any;
  errMessage:string=''
  constructor(private _service: BookAPIservices){
    this._service.getBooks().subscribe({
      next:(data)=>{this.books=data},
      error:(err)=>{this.errMessage=err}
  })
  }
}
