import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BgcolorService {



  backgroundColor: string = '#212121';

  constructor() { }

  setBackgroundColor() {
    this.backgroundColor = 'blue';
  }

  getBackgroundColor(): string {
    return this.backgroundColor;
  }

}
