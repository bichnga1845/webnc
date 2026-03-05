import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3002/api';

  constructor(private http: HttpClient) {}

  // Get all products
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`, { withCredentials: true });
  }

  // Get product by ID
  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}`, { withCredentials: true });
  }

  // Add to cart
  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/add`, {
      productId,
      quantity
    }, { withCredentials: true });
  }

  // Get cart
  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart`, { withCredentials: true });
  }

  // Update cart item
  updateCartItem(productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart/update/${productId}`, {
      quantity
    }, { withCredentials: true });
  }

  // Remove from cart
  removeFromCart(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/remove/${productId}`, { withCredentials: true });
  }

  // Clear cart
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/clear`, { withCredentials: true });
  }
}
