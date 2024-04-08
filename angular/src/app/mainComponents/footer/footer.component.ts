import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  isUserLoggedIn:boolean = false

  constructor(private authSvc:AuthService){}

  ngOnInit(){

    this.authSvc.$isLoggedIn.subscribe(data => {

      this.isUserLoggedIn = data;

    })

  }
}
