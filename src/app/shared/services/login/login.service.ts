import {Injectable} from '@angular/core';
import {ApiService} from '../../shared/services/api/api.service';
import {Observable, map, catchError, throwError} from 'rxjs';
import {UserResponseType} from '../../shared/interfaces/user-response.type';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: ApiService) {
  }

  login(email: string, password: string): Observable<UserResponseType> {
    return this.findUserByEmail(email).pipe(
      map((user) => {
        if (!user) {
          throw new Error('Usuário não encontrado');
        }
        if (user.password !== password) {
          throw new Error('Senha inválida');
        }
        return user;
      }),
      catchError((err) => throwError(() => new Error(err.message)))
    )
  }

  private findUserByEmail(email: string): Observable<UserResponseType | undefined> {
    return this.http.get<UserResponseType[]>(`/account?email=${email}`)
      .pipe(
        map((users) => users[0]),
      );
  }
}
