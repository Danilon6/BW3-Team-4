import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular';
  isNightMode: boolean = false;

  toggleNightMode(){
    this.isNightMode = !this.isNightMode;
  }
}


