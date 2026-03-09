import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FashionAPIService } from '../myservices/fashion-apiservice';

@Component({
  selector: 'app-ex58-fashion-admin',
  standalone: false,
  templateUrl: './ex58-fashion-admin.html',
  styleUrl: './ex58-fashion-admin.css',
})
export class Ex58FashionAdmin implements OnInit {
  fashions: any[] = [];
  filteredFashions: any[] = [];
  errMessage: string = '';
  successMessage: string = '';
  selectedStyle: string = 'all';
  styles: string[] = ['Street Style', 'Trend', 'Runway'];
  
  constructor(
    private fashionService: FashionAPIService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFashions();
  }

  loadFashions() {
    this.fashionService.getFashions().subscribe({
      next: (data) => {
        this.fashions = data;
        this.filteredFashions = data;
      },
      error: (err) => {
        this.errMessage = 'Error loading fashions: ' + err.message;
        console.error(err);
      }
    });
  }

  filterByStyle() {
    if (this.selectedStyle === 'all') {
      this.filteredFashions = this.fashions;
    } else {
      this.fashionService.getFashionsByStyle(this.selectedStyle).subscribe({
        next: (data) => {
          this.filteredFashions = data;
        },
        error: (err) => {
          this.errMessage = 'Error filtering fashions: ' + err.message;
        }
      });
    }
  }

  addNewFashion(event?: Event) {
    if (event) event.preventDefault();
    this.router.navigate(['/ex58-form']);
  }

  viewDetail(id: string, event?: Event) {
    if (event) event.preventDefault();
    this.router.navigate(['/ex58-form', id], { queryParams: { mode: 'view' } });
  }

  editFashion(id: string, event?: Event) {
    if (event) event.preventDefault();
    this.router.navigate(['/ex58-form', id]);
  }

  deleteFashion(id: string, title: string, event?: Event) {
    if (event) event.preventDefault();
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      this.fashionService.deleteFashion(id).subscribe({
        next: (response) => {
          this.successMessage = 'Fashion deleted successfully!';
          // Reload immediately after delete
          this.loadFashions();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          this.errMessage = 'Error deleting fashion: ' + err.message;
          setTimeout(() => {
            this.errMessage = '';
          }, 3000);
        }
      });
    }
  }

  formatDate(date: any): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
  }
}
