import { Component } from '@angular/core';
import { iPost } from '../../models/i-post';
import { AuthService } from '../../auth/auth.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {

  constructor(private authsvc:AuthService,
    private postSvc:PostService,
  ){
  }

  postArr:iPost[]=[]

  ngOnInit(){
    this.postSvc.$post.subscribe(posts =>{
      this.postArr = posts
    })
  }

  logout(){
    this.authsvc.logout()
  }


}
