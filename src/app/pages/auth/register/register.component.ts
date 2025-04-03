import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registrationForm = new FormGroup(
    {
      username: new FormControl(null, [
        Validators.pattern('^[a-zA-Z0-9]{3,12}$') // 3 à 12 caractères alphanumériques
      ]),
      email: new FormControl(null, [Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
      ]),
      password: new FormControl(null, [Validators.required,
        // Au moins 8 caractères, au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?/~]).{8,}$')
      
      ]),
      confirmPassword: new FormControl(null, [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  ); // Ajout du validateur de correspondance);

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
