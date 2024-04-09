import { Component } from '@angular/core';
import { iPost } from '../../../models/i-post';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent {

  myPostArr:iPost[] = []


  constructor(private postSvc:PostService){}

ngOnInit(){
  this.postSvc.$myPost.subscribe(myPostArr =>{
    this.myPostArr = myPostArr
})
}
}
