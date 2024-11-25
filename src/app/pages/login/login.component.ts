import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {LoginService} from './login.service';
import {SessionStorageService} from '../../shared/services/session-storage/session-storage.service';
import {AuthService} from '../../shared/services/auth/auth.service';
import {Router} from '@angular/router';
import {LoginFormComponent} from './component/login-form/login-form.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    LoginFormComponent,
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoading: boolean = false;

  constructor(private loginService: LoginService, private sessionStorageService: SessionStorageService, private authService: AuthService, private router: Router) {
  }



}
