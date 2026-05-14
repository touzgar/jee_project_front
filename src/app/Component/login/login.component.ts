import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth.service';
import { User } from '../../model/user.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: User = new User();
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(private authService: AuthServiceService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.user).subscribe({
      next: (res: HttpResponse<User>) => {
        const authHeader = res.headers.get('Authorization') || res.headers.get('authorization');
        if (!authHeader) {
          this.errorMessage = 'Token manquant dans la réponse.';
          this.isLoading = false;
          return;
        }

        const token = authHeader.startsWith('Bearer ')
          ? authHeader.replace('Bearer ', '').trim()
          : authHeader.trim();

        this.authService.saveToken(token);
        this.authService.loadToken();

        if (this.authService.isAdmin() || this.authService.isUser()) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }

        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

}
