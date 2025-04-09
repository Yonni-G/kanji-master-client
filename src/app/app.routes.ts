import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { ClassicComponent } from './pages/games/classic/classic.component';
import { GameLayoutComponent } from './pages/games/game-layout/game-layout.component';
import { ReverseComponent } from './pages/games/reverse/reverse.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:resettoken', component: ResetPasswordComponent },
  {
    path: 'dashboard/profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  }, // Add the authGuard here
  {
    path: 'games',
    component: GameLayoutComponent,
    children: [
      {
        path: 'classic',
        component: ClassicComponent,
        data: { gameTitle: 'Mode Classique', gameGoal: 'Trouvez le sens de 10 Kanji le plus vite possible !' },
      },
      {
        path: 'reverse',
        component: ReverseComponent,
        data: { gameTitle: 'Mode Reverse', gameGoal: 'Trouvez le Kanji correspondant au sens le plus vite possible !' },
      },
      { path: '', redirectTo: 'classic', pathMatch: 'full' }, // fallback
    ],
  },
  //{ path: '', redirectTo: 'games/classic', pathMatch: 'full' },
];
