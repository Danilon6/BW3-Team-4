import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router) { }

  redirectYT() {
    window.open('https://www.youtube.com/watch?v=hvL1339luv0', '_blank');
  }
}
