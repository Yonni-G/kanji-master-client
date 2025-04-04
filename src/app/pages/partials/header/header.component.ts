import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  username: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService
  ) {}

  ngOnInit() {
    this.authService.getUsername().subscribe((username) => {
      this.username = username;
    });
  }

  logout() {
    this.authService.logout();
  }

  protected() {
    this.apiService.getTestProtected().subscribe((response) => {
      console.log('Réponse protégée:', response);
    });
  }
}
