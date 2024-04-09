import { iComment } from './../../models/i-comment';
import { Component } from '@angular/core';
import { iPost } from '../../models/i-post';
import { AuthService } from '../../auth/auth.service';
import { PostService } from '../../services/post.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {

  constructor(private authsvc: AuthService,
    private postSvc: PostService,
  ) {
  }
  newPost: Partial<iPost> = {
  }
  postArr: iPost[] = []

  commentsArr: iComment[] = []

  show:boolean = false


  commentiPostArr: { [postId: number]: iComment[] } = {};

  ngOnInit() {
    this.postSvc.$post.subscribe(posts => {
      this.postArr = posts
    })

    this.postSvc.$comments.subscribe(comments => {
      this.commentsArr = comments
    })

  }

  logout() {
    this.authsvc.logout()
  }

  submitForm(newPost: NgForm) {
    this.postSvc.addPost(this.newPost).subscribe()
  }

  likedCliked: boolean = false

  like(post: iPost) {
    if (!this.likedCliked) {
      this.postSvc.addLike(post)
      this.likedCliked = true
    } else {
      this.postSvc.removeLike(post)
      this.likedCliked = false
    }
  }

  favorite(id:number){
    if (!this.likedCliked) {
      this.postSvc.addToFavorite(id).subscribe()
      this.likedCliked = true
    } else {
      this.postSvc.removeFavorite(id).subscribe()
      this.likedCliked = false
    }
  }

  getcomment(post:iPost){
    if (!post.commenti){
      this.commentiPostArr[post.id] = []
      return
    }
      const commenti = this.postSvc.filterComment(this.commentsArr, post.commenti)
      this.commentiPostArr[post.id] = commenti

  }

  showComments: boolean[] = [];

  toggleComments(index: number) {
    this.showComments[index] = !this.showComments[index];
  }

}
