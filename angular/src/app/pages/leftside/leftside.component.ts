import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-leftside',
  templateUrl: './leftside.component.html',
  styleUrl: './leftside.component.scss'
})
export class LeftsideComponent {
constructor(private authsvc:AuthService){}

  logout() {
    this.authsvc.logout()
  }
}
