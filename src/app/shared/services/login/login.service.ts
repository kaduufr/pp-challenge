import {Injectable} from '@angular/core';
import {Observable, map, catchError, throwError} from 'rxjs';
import {UserResponseType} from '../../interfaces/user-response.type';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) {
  }

  login(email: string, password: string): Observable<UserResponseType> {
    return this.findUserByEmail(email).pipe(
      map((user: UserResponseType | undefined) => {
        if (!user) {
          throw new Error('Usuário não encontrado');
        }
        if (user.password !== password) {
          throw new Error('Senha inválida');
        }
        return user;
      })
    )
  }

  findUserByEmail(email: string): Observable<UserResponseType | undefined> {
    return this.httpClient.get<UserResponseType[]>(`/account?email=${email}`)
      .pipe(
        map((users) => users[0]),
      );
  }
}
