import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { IUser } from '../models/i-user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { iLoginData } from '../models/i-login-data';

type AccessData = {
  accessToken:string,
  user:IUser
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;
  userUrl: string = environment.usersUrl;

  jwtHelper: JwtHelperService = new JwtHelperService();

  authSubject = new BehaviorSubject<IUser | null>(null);

  user$ = this.authSubject.asObservable();
  syncIsLoggedIn: boolean = false;

  isLoggedIn$ = this.user$.pipe(
    map((user) => !!user),
    tap((user) => (this.syncIsLoggedIn = user))
  );

  isUserRegisteredSubject = new BehaviorSubject<boolean>(false);
  isUserRegistered$ = this.isUserRegisteredSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(newUser: Partial<IUser>): Observable<AccessData> {
    return this.http
      .post<AccessData>(this.registerUrl, { ...newUser, favourites: [] })
      .pipe(
        tap((data) => {
          this.authSubject.next(data.user);
          localStorage.setItem('accessData', JSON.stringify(data));

          this.autoLogout(data.accessToken);

          this.isUserRegisteredSubject.next(true);
        })
      );
  }

  login(loginData: iLoginData): Observable<AccessData> {
    return this.http.post<AccessData>(this.loginUrl, loginData).pipe(
      tap((data) => {
        this.authSubject.next(data.user);
        localStorage.setItem('accessData', JSON.stringify(data));

        this.autoLogout(data.accessToken);
      })
    );
  }

  logout() {
    this.authSubject.next(null);
    localStorage.removeItem('accessData');

    this.router.navigate(['/']);
  }

  autoLogout(jwt: string) {
    const expDate = this.jwtHelper.getTokenExpirationDate(jwt) as Date;
    const expMs = expDate.getTime() - new Date().getTime();

    setTimeout(() => {
      this.logout();
    }, expMs);
  }

  restoreUser() {
    const userJson = localStorage.getItem('accessData');
    if (!userJson) return;

    const accessData: AccessData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) return;

    this.authSubject.next(accessData.user);
    this.autoLogout(accessData.accessToken);
  }

  getAccessToken(): string {
    const userJson = localStorage.getItem('accessData');
    if (!userJson) return '';

    const accessData: AccessData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) return '';

    return accessData.accessToken;
  }

  update(user: IUser) {
    return this.http.put<IUser>(this.userUrl + `/${user.id}`, user);
  }
}
