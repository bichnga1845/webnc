import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FashionAPIService } from '../myservices/fashion-apiservice';
import { Fashion } from '../myclass/Fashion';

@Component({
  selector: 'app-ex58-fashion-form',
  standalone: false,
  templateUrl: './ex58-fashion-form.html',
  styleUrl: './ex58-fashion-form.css',
})
export class Ex58FashionForm implements OnInit {
  fashion: Fashion = new Fashion();
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  fashionId: string | null = null;
  errMessage: string = '';
  successMessage: string = '';
  styles: string[] = ['Street Style', 'Trend', 'Runway'];
  isLoading: boolean = false;
  
  // Quill editor configuration
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  constructor(
    private fashionService: FashionAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Check view mode first
    this.route.queryParams.subscribe(params => {
      this.isViewMode = params['mode'] === 'view';
    });

    // Then load data
    this.route.params.subscribe(params => {
      this.fashionId = params['id'];
      if (this.fashionId) {
        this.isEditMode = true;
        this.loadFashion();
      }
    });
  }

  loadFashion() {
    if (this.fashionId) {
      this.isLoading = true;
      this.fashionService.getFashion(this.fashionId).subscribe({
        next: (data) => {
          // Directly assign to ensure reactivity
          this.fashion = {
            _id: data._id,
            title: data.title || '',
            details: data.details || '',
            thumbnail: data.thumbnail || '',
            style: data.style || '',
            createdAt: data.createdAt || new Date()
          };
          
          this.isLoading = false;
          // Trigger change detection manually
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.errMessage = 'Error loading fashion: ' + err.message;
          console.error('Load fashion error:', err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSubmit() {
    if (this.isViewMode) {
      this.backToList();
      return;
    }

    if (this.validateForm()) {
      if (this.isEditMode && this.fashionId) {
        // Update existing fashion
        this.fashionService.updateFashion(this.fashionId, this.fashion).subscribe({
          next: (response) => {
            this.successMessage = 'Fashion updated successfully!';
            setTimeout(() => {
              this.router.navigate(['/ex58']);
            }, 1000);
          },
          error: (err) => {
            this.errMessage = 'Error updating fashion: ' + err.message;
          }
        });
      } else {
        // Create new fashion
        this.fashionService.createFashion(this.fashion).subscribe({
          next: (response) => {
            this.successMessage = 'Fashion created successfully!';
            setTimeout(() => {
              this.router.navigate(['/ex58']);
            }, 1000);
          },
          error: (err) => {
            this.errMessage = 'Error creating fashion: ' + err.message;
          }
        });
      }
    }
  }

  validateForm(): boolean {
    if (!this.fashion.title || this.fashion.title.trim() === '') {
      this.errMessage = 'Title is required';
      return false;
    }
    if (!this.fashion.thumbnail || this.fashion.thumbnail.trim() === '') {
      this.errMessage = 'Thumbnail URL is required';
      return false;
    }
    if (!this.fashion.style || this.fashion.style.trim() === '') {
      this.errMessage = 'Style is required';
      return false;
    }
    if (!this.fashion.details || this.fashion.details.trim() === '') {
      this.errMessage = 'Details are required';
      return false;
    }
    return true;
  }

  backToList() {
    this.router.navigate(['/ex58']);
  }

  getPageTitle(): string {
    if (this.isViewMode) return 'View Fashion Details';
    if (this.isEditMode) return 'Edit Fashion';
    return 'Add New Fashion';
  }
}
