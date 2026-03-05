import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../myservices/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.errorMessage = '';
    
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.isLoading = true;
    
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          // Save user info to localStorage
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          // Navigate to fashion list
          this.router.navigate(['/ex53']);
        } else {
          this.errorMessage = response.message;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
