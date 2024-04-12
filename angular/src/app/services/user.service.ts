import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IUser } from '../models/i-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl: string = environment.usersUrl;
  users: IUser[] = [];

  userSubject = new BehaviorSubject<IUser[]>([]); //entrata

  users$ = this.userSubject.asObservable(); //uscita

  constructor(
    private http: HttpClient,
    private router: Router,
    private authSvc: AuthService
  ) {
    this.getAll().subscribe();
  }

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.userUrl).pipe(
      tap((users) => {
        this.userSubject.next(users);
        this.users = users;
      })
    );
  }

  getById(id: number): IUser | null {
    console.log(this.users);

    return this.users.find((u) => u.id == id) || null;
  }

  update(user: IUser) {
    return this.http.patch<IUser>(this.userUrl + `/${user.id}`, user).pipe(
      tap((responseUser) => {
        const index = this.users.findIndex((u) => u.id == user.id);
        this.users.splice(index, 1, responseUser);

        this.userSubject.next(this.users);
      })
    );
  }

  create(user: Partial<IUser>) {
    return this.http.post<IUser>(this.userUrl, user).pipe(
      tap((responseUser) => {
        this.users.push(responseUser);
        this.userSubject.next(this.users);
      })
    );
  }

  delete(id: number) {
    return this.http.delete<IUser>(this.userUrl + `/${id}`).pipe(
      tap(() => {
        const index = this.users.findIndex((u) => u.id == id);
        this.users.splice(index, 1);

        this.userSubject.next(this.users);
      })
    );
  }
}
