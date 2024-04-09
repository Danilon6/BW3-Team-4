import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { BgcolorService } from '../../services/bgcolor.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  show:boolean = false

  isUserLoggedIn:boolean = false


  constructor(private authSvc:AuthService,private colorSvc:BgcolorService){}

  ngOnInit(){
    this.authSvc.$isLoggedIn.subscribe(data => {
      this.isUserLoggedIn = data;
    })



  }

  logout():void{
    this.authSvc.logout()
  }

  changeColor() {
    this.colorSvc.setBackgroundColor();

}



}
