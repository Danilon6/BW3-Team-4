import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { iLoginData } from '../../models/i-login-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginUser: iLoginData = {
    email: 'mario@gmail.com',
    password: 'password'
  }

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) { }

  login() {
    this.authSvc.login(this.loginUser)
      .subscribe(data => {
        this.router.navigate(['posts'])
      })
  }
}
