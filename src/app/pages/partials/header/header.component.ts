import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  username: string | null = null;
  isAuthenticated: boolean = false;


  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService
  ) {
    this.authService.getUsername$().subscribe((username) => {
      this.username = username;
      this.isAuthenticated = this.authService.isAuthenticated();
    });
  }

  logout() {
    this.authService.logout();
  }

  protected(event: Event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien
    this.apiService.getTestProtected().subscribe((response) => {
      console.log('Réponse protégée:', response);
    });
  }

  test1() {
    this.authService.test().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  test2() {
    this.authService.checkRefreshToken().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
