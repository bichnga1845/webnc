import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILogin } from '../myclass/ilogin';

@Component({
  selector: 'app-ex21',
  standalone: false,
  templateUrl: './ex21.html',
  styleUrl: './ex21.css',
})
export class Ex21 implements OnInit {
  loginData: ILogin = {
    email: '',
    password: ''
  };

  jsonOutput: string = '';
  saveLogin: boolean = false;
  emailError: string = '';
  passwordError: string = '';

  // Thông tin đăng nhập đúng (simulation)
  private correctEmail: string = 'admin@gmail.com';
  private correctPassword: string = '12345';

  constructor(private router: Router) {}

  ngOnInit() {
    // Load saved login info from localStorage
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    const savedCheckbox = localStorage.getItem('saveLogin');

    if (savedCheckbox === 'true' && savedEmail && savedPassword) {
      this.loginData.email = savedEmail;
      this.loginData.password = savedPassword;
      this.saveLogin = true;
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onLogin() {
    // Reset errors
    this.emailError = '';
    this.passwordError = '';
    this.jsonOutput = '';

    // Validation
    let isValid = true;

    if (!this.validateEmail(this.loginData.email)) {
      this.emailError = 'Invalid email format!';
      isValid = false;
    }

    if (this.loginData.password.length < 5) {
      this.passwordError = 'Password must be at least 5 characters!';
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Display JSON output
    this.jsonOutput = JSON.stringify(this.loginData);

    // Save to localStorage if checkbox is checked
    if (this.saveLogin) {
      localStorage.setItem('savedEmail', this.loginData.email);
      localStorage.setItem('savedPassword', this.loginData.password);
      localStorage.setItem('saveLogin', 'true');
    } else {
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('savedPassword');
      localStorage.removeItem('saveLogin');
    }

    // Check login credentials
    if (this.loginData.email === this.correctEmail && 
        this.loginData.password === this.correctPassword) {
      // Navigate to another component (ex: about page)
      setTimeout(() => {
        this.router.navigate(['/gioi-thieu']);
      }, 1000);
    }
  }
}
