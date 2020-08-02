import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const BACKEND_URL = 'http://localhost:8000/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}
  getToken() {
    return this.token;
  }
  getUserId() {
    return this.userId;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  createUser(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    username: string
  ) {
    const authData = {
      email: email,
      password: password,
      first_name: first_name,
      last_name: last_name,
      username: username,
    };
    this.http.post(BACKEND_URL + 'signup/', authData).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }
  login(username: string, password: string) {
    const authData = {
      username: username,
      password: password,
    };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
      }>(BACKEND_URL + 'login/', authData)
      .subscribe(
        (responce) => {
          console.log(responce);

          const token = responce.token;
          this.token = token;
          if (token) {
            const expiresInDuration = responce.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = responce.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          console.log('Here');

          console.log(error);

          this.authStatusListener.next(false);
        }
      );
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  logout() {
    const userData = {
      userId: this.userId,
    };
    this.http
      .post<{ message: string }>(BACKEND_URL + 'logout/', userData)
      .subscribe(
        (message) => {
          // console.log(message);
        },
        (error) => {
          console.error(error);
        }
      );
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveAuthData(token: string, exprirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', exprirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
