import { Component } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { IBookManagement } from '../myclass/IBookManagement';

@Component({
  selector: 'app-book-management-ex50',
  standalone: false,
  templateUrl: './book-management-ex50.html',
  styleUrl: './book-management-ex50.css',
})
export class BookManagementEx50 {
  // Local storage for books - loaded from JSON file
  books: IBookManagement[] = [];
  
  selectedBook: IBookManagement | null = null;
  editingBook: IBookManagement | null = null;
  newBook: IBookManagement = { 
    BookId: '', 
    BookName: '', 
    Tensach: '',
    Price: 0, 
    Giaban: '',
    Image: '', 
    Mota: '', 
    Ngaycapnhat: '', 
    Soluongton: '', 
    MaCD: '', 
    MaNXB: '' 
  };
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  showDetails: boolean = false;
  errMessage: string = '';
  uploadProgress: number = 0;
  selectedFileName: string = '';

  constructor(private http: HttpClient, private router: Router) {
    this.loadBooks();
  }

  loadBooks() {
    this.http.get<IBookManagement[]>('http://localhost:3000/books').subscribe({
      next: (data) => {
        this.books = data;
        console.log('Loaded books from server');
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.errMessage = 'Error loading books. Make sure server is running at http://localhost:3000';
      }
    });
  }

  showCreateNewForm() {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.showDetails = false;
    // Generate next BookId
    const nextId = `BK${String(this.books.length + 1).padStart(3, '0')}`;
    this.newBook = { 
      BookId: nextId, 
      BookName: '', 
      Tensach: '',
      Price: 0, 
      Giaban: '',
      Image: '', 
      Mota: '', 
      Ngaycapnhat: new Date().toLocaleDateString('vi-VN'), 
      Soluongton: '0', 
      MaCD: '', 
      MaNXB: '' 
    };
    this.selectedFileName = '';
  }

  createBook() {
    if (!this.newBook.BookId || !this.newBook.BookName) {
      alert('Please fill required fields: BookId and BookName');
      return;
    }

    // Check if BookId already exists
    if (this.books.some(b => b.BookId === this.newBook.BookId)) {
      alert('BookId already exists! Please use a different BookId.');
      return;
    }

    // Auto-fill Giaban if Price is provided
    if (this.newBook.Price && !this.newBook.Giaban) {
      this.newBook.Giaban = `${this.newBook.Price.toLocaleString()} VNĐ`;
    }

    // Auto-fill Tensach if not provided
    if (!this.newBook.Tensach) {
      this.newBook.Tensach = this.newBook.BookName;
    }

    // Send to server
    this.http.post('http://localhost:3000/books', this.newBook).subscribe({
      next: (data) => {
        console.log('Book created successfully');
        this.showCreateForm = false;
        this.loadBooks();
        this.errMessage = '';
      },
      error: (err) => {
        this.errMessage = 'Error creating book';
        console.error(err);
      }
    });
  }

  showEditBookForm(book: IBookManagement) {
    this.editingBook = { ...book };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetails = false;
    this.selectedFileName = book.Image || '';
  }

  updateBook() {
    if (!this.editingBook) return;

    // Auto-fill Giaban if Price is provided
    if (this.editingBook.Price && !this.editingBook.Giaban) {
      this.editingBook.Giaban = `${this.editingBook.Price.toLocaleString()} VNĐ`;
    }

    // Send update to server
    this.http.put(`http://localhost:3000/books/${this.editingBook.BookId}`, this.editingBook).subscribe({
      next: (data) => {
        console.log('Book updated successfully');
        this.showEditForm = false;
        this.loadBooks();
        this.errMessage = '';
      },
      error: (err) => {
        this.errMessage = 'Error updating book';
        console.error(err);
      }
    });
  }

  showBookDetails(book: IBookManagement) {
    this.selectedBook = book;
    this.showDetails = true;
    this.showCreateForm = false;
    this.showEditForm = false;
  }

  deleteBook(bookId: string) {
    if (confirm(`Are you sure you want to delete book ${bookId}?`)) {
      this.http.delete(`http://localhost:3000/books/${bookId}`).subscribe({
        next: (data) => {
          console.log('Book deleted successfully');
          this.loadBooks();
          this.errMessage = '';
        },
        error: (err) => {
          this.errMessage = 'Error deleting book';
          console.error(err);
        }
      });
    }
  }

  onFileSelected(event: any, isEdit: boolean = false) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      
      // Convert file to base64 for local storage
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        if (isEdit && this.editingBook) {
          this.editingBook.Image = imageUrl;
        } else {
          this.newBook.Image = imageUrl;
        }
        this.uploadProgress = 100;
        setTimeout(() => {
          this.uploadProgress = 0;
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  }

  cancelForm() {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showDetails = false;
    this.uploadProgress = 0;
    this.selectedFileName = '';
  }

  getImageUrl(imageName: string): string {
    if (!imageName) return 'https://via.placeholder.com/150/CCCCCC/666666?text=No+Image';
    // Return URL directly (supports both placeholder URLs and base64 data URLs)
    return imageName;
  }

  handleImageError(event: any, imageName: string) {
    const img = event.target;
    // Fallback to default placeholder on error
    img.src = 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Error';
  }
}
