import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from '../myservices/payment.service';

@Component({
  selector: 'app-momo-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './momo-payment.html',
  styleUrls: ['./momo-payment.css']
})
export class MomoPaymentComponent implements OnInit {
  // Form data
  amount: number = 50000;
  orderInfo: string = 'Thanh toán đơn hàng';
  extraData: string = '';
  
  // UI states
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Payment result (nếu có)
  paymentResult: any = null;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Kiểm tra xem có phải trang result không
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        // Đây là trang result
        this.paymentResult = {
          orderId: params['orderId'] || '',
          resultCode: params['resultCode'] || '',
          message: params['message'] || '',
          amount: params['amount'] || '',
          transId: params['transId'] || ''
        };
      }
    });
  }

  /**
   * Xử lý thanh toán
   */
  handlePayment(): void {
    // Validate
    if (!this.amount || this.amount < 1000) {
      this.errorMessage = 'Số tiền phải lớn hơn 1,000 VND';
      return;
    }

    if (!this.orderInfo) {
      this.errorMessage = 'Vui lòng nhập thông tin đơn hàng';
      return;
    }

    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    // Call API
    this.paymentService.createPayment({
      amount: this.amount.toString(),
      orderInfo: this.orderInfo,
      extraData: this.extraData
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.payUrl) {
          this.successMessage = 'Đang chuyển đến trang thanh toán MoMo...';
          // Redirect to MoMo payment page
          setTimeout(() => {
            window.location.href = response.payUrl || '';
          }, 1000);
        } else {
          this.errorMessage = response.message || 'Không thể tạo thanh toán';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Lỗi kết nối server';
        console.error('Payment error:', error);
      }
    });
  }

  /**
   * Format số tiền
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  /**
   * Quay lại trang thanh toán
   */
  backToPayment(): void {
    this.router.navigate(['/momo-payment']);
  }

  /**
   * Kiểm tra trạng thái thanh toán
   */
  isPaymentSuccess(): boolean {
    return this.paymentResult && this.paymentResult.resultCode === '0';
  }
}
