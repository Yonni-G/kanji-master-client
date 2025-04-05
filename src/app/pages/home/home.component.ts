import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  private readonly authService = inject(AuthService);

  test() {
    this.authService.test().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
