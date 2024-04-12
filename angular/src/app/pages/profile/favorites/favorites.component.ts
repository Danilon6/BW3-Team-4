import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { iPost } from '../../../models/i-post';
import {PostService } from '../../../services/post.service';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {


  favoritePostArr:iPost[] = []


  constructor(private postSvc:PostService, private authsvc:AuthService){}

ngOnInit(){
  this.postSvc.$favoritePost.subscribe(favoritePostArr =>{
    this.favoritePostArr = favoritePostArr
})
}



logout() {
  this.authsvc.logout()
}
}
