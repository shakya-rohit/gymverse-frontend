import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  username = '';
  password = '';
  error: string = '';
  role: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.name || !this.email || !this.username || !this.password) {
      this.error = 'All fields are required';
      return;
    }

    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
      role: this.role
    };

    this.authService.register(user).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}