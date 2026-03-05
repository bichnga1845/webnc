import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../myservices/product.service';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selected?: boolean;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  standalone: false
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading: boolean = true;
  total: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    
    // Timeout sau 10 giây nếu không load được
    const timeoutId = setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        alert('Không thể kết nối đến server. Vui lòng kiểm tra server đã chạy chưa!');
      }
    }, 10000);
    
    this.productService.getCart().subscribe({
      next: (response: any) => {
        clearTimeout(timeoutId);
        console.log('Cart response:', response);
        if (response && response.success) {
          this.cartItems = response.cart.map((item: CartItem) => ({
            ...item,
            selected: false
          }));
          this.total = response.total;
          console.log('CartItems:', this.cartItems);
          console.log('Total:', this.total);
        } else {
          this.cartItems = [];
          this.total = 0;
        }
        this.loading = false;
        console.log('Loading:', this.loading);
        this.cdr.detectChanges(); // Force change detection
        console.log('CartItems length:', this.cartItems.length);
      },
      error: (error) => {
        clearTimeout(timeoutId);
        console.error('Error loading cart:', error);
        alert('Lỗi kết nối đến server: ' + error.message);
        this.cartItems = [];
        this.total = 0;
        this.loading = false;
      }
    });
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) {
      return;
    }

    // Tối ưu: Cập nhật UI ngay lập tức
    const item = this.cartItems.find(i => i.productId === productId);
    if (item) {
      const oldQuantity = item.quantity;
      item.quantity = quantity;
      this.calculateTotal();
      
      // Gọi API ở background
      this.productService.updateCartItem(productId, quantity).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.total = response.total;
          }
        },
        error: (error) => {
          console.error('Error updating cart:', error);
          // Rollback nếu có lỗi
          item.quantity = oldQuantity;
          this.calculateTotal();
          alert('Có lỗi khi cập nhật giỏ hàng!');
        }
      });
    }
  }
  
  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  removeSelected() {
    const selectedItems = this.cartItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn sản phẩm cần xóa!');
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa ${selectedItems.length} sản phẩm?`)) {
      return;
    }

    // Tối ưu: Xóa khỏi UI ngay lập tức
    this.cartItems = this.cartItems.filter(item => !item.selected);
    this.calculateTotal();

    // Remove từng item ở background
    selectedItems.forEach(item => {
      this.productService.removeFromCart(item.productId).subscribe({
        error: (error) => {
          console.error('Error removing item:', error);
          // Reload nếu có lỗi
          this.loadCart();
        }
      });
    });
  }

  updateCart() {
    // Không cần reload, chỉ hiện thông báo
    alert('Giỏ hàng đã được cập nhật!');
  }

  continueShopping() {
    this.router.navigate(['/product-list']);
  }

  clearCart() {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      return;
    }

    // Tối ưu: Xóa UI ngay
    this.cartItems = [];
    this.total = 0;

    this.productService.clearCart().subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('Đã xóa toàn bộ giỏ hàng!');
        }
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        // Reload nếu có lỗi
        this.loadCart();
        alert('Có lỗi khi xóa giỏ hàng!');
      }
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + ' đ';
  }

  getSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.cartItems.forEach(item => item.selected = checked);
  }

  isAllSelected(): boolean {
    return this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
  }

  getSelectedCount(): number {
    return this.cartItems.filter(item => item.selected).length;
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}
