import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router = inject(Router);

  registrationForm = new FormGroup(
    {
      username: new FormControl(null, [
        Validators.pattern('^[a-zA-Z0-9]{3,12}$'), // 3 à 12 caractères alphanumériques
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
      ]),
      password: new FormControl(null, [
        Validators.required,
        // Au moins 8 caractères, au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?/~]).{8,}$'
        ),
      ]),
      confirmPassword: new FormControl(null, [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  ); // Ajout du validateur de correspondance);

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);

      let user: User = {
        username: this.registrationForm.value.username || '',
        email: this.registrationForm.value.email || '',
        password: this.registrationForm.value.password || '',
        confirmPassword: this.registrationForm.value.confirmPassword || '',
      };

      // on va interroger notre api via le service authService
      this.authService.register(user)
        .subscribe({
          next: (response) => {
            console.log('Registration successful', response);
            this.messageService.setMessage(
              { text: 'Registration successful', type: 'success' },
              5000
            );
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Registration failed', error);
            this.messageService.setMessage(error.error.message);
          },
        });
    } else {
      console.log('Form is invalid');
      this.messageService.setMessage({ text: 'Form is invalid', type: 'error' });
    }
  }
}
