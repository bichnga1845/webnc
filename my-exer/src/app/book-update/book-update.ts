import { Component, OnInit } from '@angular/core';
import { Book } from '../myclass/iBook';
import { BookAPIservices } from '../myservices/book-apiservices';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-update',
  standalone: false,
  templateUrl: './book-update.html',
  styleUrl: './book-update.css',
})
export class BookUpdate implements OnInit {
  book=new Book();
  books:any
  errMessage:string=''
  bookId:string=''
  constructor(private _service: BookAPIservices, private _route: ActivatedRoute, private _router: Router){
  }
  
  ngOnInit(){
    this.bookId = this._route.snapshot.params['id'];
    this._service.getBook(this.bookId).subscribe({
      next:(data)=>{this.book=data},
      error:(err)=>{this.errMessage=err}
    })
    
    this._service.getBooks().subscribe({
      next:(data)=>{this.books=data},
      error:(err)=>{this.errMessage=err}
    })
  }
  
  putBook()
  {
    this._service.putBook(this.book).subscribe({
      next:(data)=>{
        alert('Update thành công!');
        this._router.navigate(['/ex39']);
      },
      error:(err)=>{this.errMessage=err}
    })
  }

  
}
