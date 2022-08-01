import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const signUpUrl = 'http://localhost:8080/api/auth/signup';
const logInUrl = 'http://localhost:8080/api/auth/signin';
const logOutUrl = 'http://localhost:8080/api/auth/signout';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  signup(data: any): Observable<any> {
    return this.http.post(signUpUrl, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(logInUrl, data);
  }

  logout(): Observable<any> {
    return this.http.post(logOutUrl, {});
  }
}
