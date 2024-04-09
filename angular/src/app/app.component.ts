import { Component } from '@angular/core';
import { BgcolorService } from './services/bgcolor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular';
  isDark:boolean = true
  render: any;
  backgroundColor: string;

constructor(private colorSvc:BgcolorService){

  this.backgroundColor = this.colorSvc.getBackgroundColor();
}
  changecolor(){
    if(this.isDark){
      this.render.setStyle(document.body,'background-color','#212121');
}
else{
this.render.setStyle(document.body,'background-color','#fff')
}
this.isDark = !this.isDark;
}
}
