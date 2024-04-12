import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { IUser } from '../../models/i-user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  newUser:Partial<IUser> = {}

  constructor(
    private authSvc:AuthService,
    private router:Router
    ){}

  register(){
    this.authSvc.register(this.newUser)
    .subscribe(data => {
      this.router.navigate(['/auth/login'])
    })
  }
}
