import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../myservices/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  loading: boolean = true;
  cartCount: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCartCount();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.products = response.products;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadCartCount() {
    this.productService.getCart().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cartCount = response.cartCount;
        }
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      }
    });
  }

  addToCart(productId: string) {
    this.productService.addToCart(productId, 1).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('Đã thêm sản phẩm vào giỏ hàng!');
          this.cartCount = response.cartCount;
        }
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        alert('Có lỗi khi thêm vào giỏ hàng!');
      }
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + ' đ';
  }

  viewCart() {
    this.router.navigate(['/cart']);
  }
}
