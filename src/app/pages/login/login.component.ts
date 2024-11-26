import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
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
  constructor() {}
}
