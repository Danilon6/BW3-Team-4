import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { iUser } from '../models/i-user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { iLoginData } from '../models/i-login-data';

type accessData = {
  accessToken:string,
  user:iUser
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper: JwtHelperService= new JwtHelperService()

  authSubject = new BehaviorSubject<iUser | null>(null)

  $user = this.authSubject.asObservable()

  syncIsLoggedIn:boolean = false

  $isLoggedIn = this.$user.pipe(
    map(user => !!user),
    tap(user => this.syncIsLoggedIn = user)
  )

  constructor(
    private http:HttpClient,
    private route:Router
  ){
    this.getUserAfterRefresh()
  }


    registerUrl:string = environment.registerUrl
    loginUrl:string = environment.loginUrl


    register(newUser:Partial<iUser>): Observable<accessData>{
      return this.http.post<accessData>(this.registerUrl, newUser)
      .pipe(tap(data =>{
        this.authSubject.next(data.user)
        localStorage.setItem("accessData", JSON.stringify(data))
      }))
    }

    login(loginData:iLoginData):Observable<accessData>{
      return this.http.post<accessData>(this.loginUrl, loginData)
      .pipe(tap(data =>{
        this.authSubject.next(data.user)
        localStorage.setItem("accessData", JSON.stringify(data))
        this.autologout(data.accessToken)
      }))
    }

    logout():void{
      this.authSubject.next(null)
      localStorage.removeItem("accessData")
      this.route.navigate([""])
    }

    autologout(jwt:string):void{
      const expirationDate = this.jwtHelper.getTokenExpirationDate(jwt) as Date
      const exiprationMs = expirationDate.getTime() - new Date().getTime()

    setTimeout(() => {
      this.logout()
    }, exiprationMs)
    }

    getUserAfterRefresh():void{
      const user = localStorage.getItem("accessData")
      if (!user) return

      const accessData:accessData = JSON.parse(user)

      if (this.jwtHelper.isTokenExpired(accessData.accessToken)) return

      this.authSubject.next(accessData.user)
      this.autologout(accessData.accessToken)
    }

    getAuthToken():string{
      const user = localStorage.getItem("accessData")
      if (!user) return ""

      const accessData:accessData = JSON.parse(user)

      if (this.jwtHelper.isTokenExpired(accessData.accessToken)) return ""

      return accessData.accessToken
    }
}
