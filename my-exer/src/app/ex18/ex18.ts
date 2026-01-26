import { Component, OnInit } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Customer {
  Id: string;
  Name: string;
  Email: string;
  Age: number;
  Image: string;
}

interface CustomerType {
  CustomerTypeId: number;
  CustomerTypeName: string;
  Customers: Customer[];
}

@Component({
  selector: 'app-ex18',
  templateUrl: './ex18.html',
  styleUrls: ['./ex18.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Ex18 implements OnInit {

  customerTypes: CustomerType[] = [];

  constructor(private http: HttpClient) {
    console.log('Ex18 Component initialized');
  }

  ngOnInit(): void {
    console.log('Loading customer data...');
    this.http.get<CustomerType[]>('assets/customers14.json').subscribe({
      next: (data) => {
        console.log('Customer data loaded successfully:', data);
        this.customerTypes = data;
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        alert('Error loading data: ' + err.message);
      }
    });
  }
}
