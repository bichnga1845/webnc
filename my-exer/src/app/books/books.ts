import { Component } from '@angular/core';
import { BookAPIservices } from '../myservices/book-apiservices';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-books',
  standalone: false,
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books {
  books:any;
  errMessage:string=''
  uploadingBookId: string = ''; // ID của book đang upload
  uploadProgress: {[key: string]: number} = {}; // Progress cho từng book
  
  constructor(private _service: BookAPIservices, 
              private router:Router, 
              private activatedRoute:ActivatedRoute,
              private http: HttpClient) {
    this.loadBooks();
  }

  loadBooks() {
    this._service.getBooks().subscribe({
      next:(data)=>{this.books=data},
      error:(err)=>{this.errMessage=err}
    })
  }

  view_detail(bookId:any){
    this.router.navigate(['ex41', bookId]);
  }

  onFileSelected(event: any, bookId: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadingBookId = bookId;
      const formData = new FormData();
      formData.append("image", file);
      
      // Upload ảnh lên server upload (gọi trực tiếp port 3001)
      this.http.post("http://localhost:3001/upload", formData, {
        reportProgress: true,
        observe: 'events',
        responseType: 'text'
      }).subscribe({
        next: (event) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress[bookId] = Math.round(100 * (event.loaded / event.total!));
          }
          if (event.type == HttpEventType.Response) {
            // Upload thành công, cập nhật tên ảnh trong book
            const fileName = file.name;
            const book = this.books.find((b: any) => b.BookId === bookId);
            if (book) {
              book.Image = fileName;
              // Lưu vào database
              this.http.put(`http://localhost:3000/books/${bookId}`, book).subscribe({
                next: (data) => {
                  console.log('Book updated in database');
                  // Trigger change detection bằng cách tạo array mới
                  this.books = [...this.books];
                },
                error: (err) => {
                  console.error('Database update error:', err);
                }
              });
            }
            delete this.uploadProgress[bookId];
            this.uploadingBookId = '';
          }
        },
        error: (err) => {
          console.error('Upload error:', err);
          this.errMessage = 'Error uploading image';
          delete this.uploadProgress[bookId];
        }
      });
    }
  }

  handleImageError(event: any, imageName: string) {
    const img = event.target;
    // Chỉ fallback một lần, tránh infinite loop
    if (!img.src.includes('localhost:3000')) {
      img.src = `http://localhost:3000/images/${imageName}`;
    }
  }

  process_remove(book:any)
  {
    if(confirm('Are you sure you want to delete this book "' + book.BookName + '"?'))
    {
      this._service.deleteBook(book.BookId).subscribe({
        next:(data)=>{
          alert('Xóa thành công!');
          this.loadBooks();
        },
        error:(err)=>{this.errMessage=err}
      })
    }
  }
}
