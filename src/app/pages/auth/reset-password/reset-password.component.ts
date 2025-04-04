import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { User } from '../../../models/user';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';

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
  private readonly route = inject(ActivatedRoute);

  token: string | null = null;

  // Formulaire de réinitialisation de mot de passe
  form = new FormGroup(
    {
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
  );

  ngOnInit(): void {
    // Récupération propre du token depuis l'URL
    this.route.paramMap.subscribe((params) => {
      this.token = params.get('token');

      if (!this.token) {
        this.messageService.setMessage({
          text: 'Token non trouvé dans l’URL',
          type: 'error',
        });
        this.router.navigate(['/login']);
      } else {
        // Vérification du token
        this.authService.verifyResetToken(this.token).subscribe({
          next: () => {
            // token valide, on ne fait rien
          },
          error: (error) => {
            console.error('Token invalide', error);
            this.messageService.setMessage({
              text: error.error.message,
              type: 'error',
            });
          },
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {

      let user: User = {
        username: '',
        email: '',
        password: this.form.value.password || '',
        confirmPassword: this.form.value.confirmPassword || '',
      };
      this.authService
        .resetPassword(this.token!, user.password, user.confirmPassword)
        .subscribe({
          next: (response) => {
            this.messageService.setMessage(
              {
                text: 'Réinitialisation réussie. Vous pouvez dès à présent vous connecter à nouveau.',
                type: 'success',
              },
              5000
            );
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Réinitialisation échouée', error);
            this.messageService.setMessage({
              text: error.error.message,
              type: 'error',
            });
          },
        });
    }
  }
}
