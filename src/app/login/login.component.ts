import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {LoginService} from './login.service';
import {SessionStorageService} from '../shared/services/session-storage/session-storage.service';
import {AuthService} from '../shared/services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form!: FormGroup
  error: string = '';
  loading: boolean = false;

  constructor(private loginService: LoginService, private sessionStorageService: SessionStorageService, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup<any>({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  ngAfterViewInit() {
    const isAuthenticated = this.authService.isAuthenticated()
    if (isAuthenticated) {
      this.router.navigate(['/dashboard'])
    }
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  submit() {
    if (this.form.invalid) {
      this.error = 'Preencha os campos corretamente';
      return
    }
    this.error = '';
    this.loading = true

    const {email, password} = this.form.value
    this.loginService.login(email, password).subscribe({
      next: (user) => {
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email
        }
        this.sessionStorageService.setItem('user', userData)
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        console.error(err.message);
        this.error = err.message;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getErrorMessage(fieldName: string): string | null {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo é obrigatório';
    }

    if (field?.hasError('email')) {
      return 'Email inválido';
    }

    if (field?.hasError('minlength')) {
      return `A senha precisa ter no mínimo 6 caracteres.`;
    }

    return null
  }


}
