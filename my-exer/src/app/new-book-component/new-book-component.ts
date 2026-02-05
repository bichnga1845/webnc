import { Component } from '@angular/core';
import { Book } from '../myclass/iBook';
import { BookAPIservices } from '../myservices/book-apiservices';

@Component({
  selector: 'app-new-book-component',
  standalone: false,
  templateUrl: './new-book-component.html',
  styleUrl: './new-book-component.css',
})
export class NewBookComponent {
  book=new Book();
  books:any
  errMessage:string=''
  constructor(private _service: BookAPIservices){
    this._service.getBooks().subscribe({
      next:(data)=>{this.books=data},
      error:(err)=>{this.errMessage=err}
      })
      }
  postBook()
  {
    this._service.postBook(this.book).subscribe({
      next:(data)=>{this.books=data},
      error:(err)=>{this.errMessage=err}
      })
  }
}
