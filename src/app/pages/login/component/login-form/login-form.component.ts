import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginService} from '../../../../shared/services/login/login.service';
import {SessionStorageService} from '../../../../shared/services/session-storage/session-storage.service';
import {AuthService} from '../../../../shared/services/auth/auth.service';
import {Router} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {finalize} from 'rxjs';
import {LoginDTO} from '../../../../core/DTO/loginDTO';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit, AfterViewInit {
  form!: FormGroup
  error: string = '';
  loading: boolean = false;
  showPassword: boolean = false

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

    const {email, password}: LoginDTO = this.form.value
    this.loginService.login(email, password)
      .pipe(finalize(() => {
        this.loading = false
      })).subscribe({
      next: (user) => {
        this.sessionStorageService.setItem<string>('user', user.email)
        this.router.navigate(['/dashboard'])
      },
      error: (error: unknown) => {
        if (error instanceof Error) {
          this.error = error.message;
          return
        }
        this.error = 'Erro ao realizar login';
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

  togglePassword() {
    this.showPassword = !this.showPassword
  }
}
