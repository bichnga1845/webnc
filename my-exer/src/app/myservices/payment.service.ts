import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentRequest {
  amount: string;
  orderInfo: string;
  extraData?: string;
}

export interface PaymentResponse {
  success: boolean;
  payUrl?: string;
  orderId?: string;
  message?: string;
  resultCode?: number;
}

export interface PaymentStatus {
  success: boolean;
  payment?: {
    orderId: string;
    requestId: string;
    amount: string;
    orderInfo: string;
    status: string;
    transId?: string;
    resultCode?: string;
    message?: string;
    createdAt: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3003/api/payment';

  constructor(private http: HttpClient) {}

  /**
   * Tạo payment request
   */
  createPayment(data: PaymentRequest): Observable<PaymentResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<PaymentResponse>(
      `${this.apiUrl}/create`,
      data,
      { headers }
    );
  }

  /**
   * Kiểm tra trạng thái thanh toán
   */
  getPaymentStatus(orderId: string): Observable<PaymentStatus> {
    return this.http.get<PaymentStatus>(
      `${this.apiUrl}/status/${orderId}`
    );
  }

  /**
   * Lấy danh sách tất cả payments (for testing)
   */
  getAllPayments(): Observable<any> {
    return this.http.get(`${this.apiUrl}s`);
  }
}
