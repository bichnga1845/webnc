import { Component } from '@angular/core';
import { BookAPIservices } from '../myservices/book-apiservices';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-detail-component',
  standalone: false,
  templateUrl: './book-detail-component.html',
  styleUrl: './book-detail-component.css',
})
export class BookDetailComponent {
  book:any;
  errMessage:string=''
  constructor(private _service: BookAPIservices,
     private router:Router, 
     private activatedRoute:ActivatedRoute){
      activatedRoute.params.subscribe(params=>{
        console.log('Route params:', params);
        let id=params['id'];
        console.log('BookId from route:', id);
        if(id!=null){
          this.searchBook(id);
        }
      })
  }
  searchBook(bookId:string)
  {
    console.log('Searching for book with ID:', bookId);
    this._service.getBook(bookId).subscribe({
    next:(data)=>{
      console.log('Book data received:', data);
      this.book=data;
    },
    error:(err)=>{
      console.error('Error fetching book:', err);
      this.errMessage=err;
    }
    })
  }

  getImageUrl(imageName: string): string {
    if (!imageName) return '';
    // Mặc định dùng server 3000 (ảnh cũ)
    return `http://localhost:3000/images/${imageName}`;
  }
}
