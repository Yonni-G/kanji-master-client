import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../../models/user';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router = inject(Router);

  form = new FormGroup({
    password: new FormControl(null, [
      Validators.required,
      // Au moins 8 caractères, au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?/~]).{8,}$'
      ),      
    ]),
    confirmPassword: new FormControl(null, [Validators.required]),
  });

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);

      let user: User = {
        username: '',
        email: '',
        password: this.form.value.password || '',
        confirmPassword: this.form.value.confirmPassword || '',
      };
    }
  }
/*
      // on va interroger notre api via le service authService
      this.authService.login(user).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.messageService.setMessage(
            { text: 'connexion successful', type: 'success' },
            5000
          );
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('connexion failed', error);
          this.messageService.setMessage({
            text: error.error.message,
            type: 'error',
          });
        },
      });
    } else {
      console.log('Form is invalid');
      this.messageService.setMessage({
        text: 'Form is invalid',
        type: 'error',
      });
    }
  }
    */
}
