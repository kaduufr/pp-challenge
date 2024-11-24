import { Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LoginComponent} from './pages/login/login.component';
import {authGuard} from './auth.guard';

export const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [authGuard]
  },
  {
    path: '**', redirectTo: ''
  }
];
