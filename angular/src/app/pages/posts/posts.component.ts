import { iComment } from './../../models/i-comment';
import { Component } from '@angular/core';
import { iPost } from '../../models/i-post';
import { AuthService } from '../../auth/auth.service';
import { PostService } from '../../services/post.service';
import { NgForm } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {

  comment:Partial<iComment> = {}

  constructor(private authsvc: AuthService,
    private postSvc: PostService,
    private commentsSvc:CommentsService
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

    this.commentsSvc.$comments.subscribe(comments => {
      this.commentsArr = comments
    })

    this.authsvc.$user.subscribe(data =>{
      if (data) {
        this.loggedUserName = data.name
      }
    })

  }

 

  submitForm(newPost: NgForm) {
    this.postSvc.addPost(this.newPost).subscribe()
  }
  submitComment(newComment: NgForm, post:iPost) {
    this.commentsSvc.addComment(this.comment, post).subscribe(() => {
      newComment.reset()
    })
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

  loggedUserName:string = ""

  deleteComment(id:number){
    this.commentsSvc.deleteComment(id).subscribe()
  }


}
