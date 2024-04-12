import { Component } from '@angular/core';
import { iPost } from '../../../models/i-post';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent {
  editShow:boolean = false
  myPostArr:iPost[] = []


  constructor(private postSvc:PostService, private authsvc:AuthService){}

ngOnInit(){
  this.postSvc.$myPost.subscribe(myPostArr =>{
    this.myPostArr = myPostArr
})
}


logout() {
  this.authsvc.logout()
}

elimina(id:number){
  this.postSvc.removePost(id).subscribe()
}

edit(post:iPost){
  this.postSvc.editPost(post).subscribe()
}
}
