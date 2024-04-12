import { IComment } from './../../models/i-comment';
import { Component } from '@angular/core';
import { IPost } from '../../models/i-post';
import { AuthService } from '../../auth/auth.service';
import { PostService } from '../../services/post.service';
import { CommentsService } from '../../services/comments.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/i-user';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {

  posts: IPost[] = [];
  comments: IComment[] = [];
  users: IUser[] = [];

  user: IUser | undefined;

  newPost: Partial<IPost> = {};
  newComment: Partial<IComment> = {};

  commentiPostArr: { [postId: number]: IComment[] } = {};
  newComments: { [postId: number]: Partial<IComment> } = {};

  showComments: boolean[] = [];

  constructor(
    private postSvc: PostService,
    private authSvc: AuthService,
    private commentSvc: CommentsService,
    private userSvc: UserService
  ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      this.user = user || undefined;
    });

    this.userSvc.users$.subscribe((users) => {
      this.users = users;
    });

    this.postSvc.$post.subscribe((posts) => {
      this.posts = posts;

      this.posts.forEach((post) => {
        this.newComments[post.id] = {};
      });
    });

    this.commentSvc.$comment.subscribe((comments) => {
      this.comments = comments;
    });
  }

  deletePost(id: number) {
    this.postSvc.delete(id).subscribe();
  }

  addPost(form:NgForm) {
    if (this.user) {
      const postToAdd: Partial<IPost> = {
        ...this.newPost,
        authorId: this.user.id,
        likes: 0,
      };
      this.postSvc.create(postToAdd).subscribe(() => {
        this.newPost = {};
        form.reset()
      });
    }
  }

  toggleLike(post: IPost) {
    if (!this.user || !this.user.favourites) {
      return;
    }

    const index = this.user.favourites.indexOf(post.id);

    if (index !== -1) {
      this.user.favourites.splice(index, 1);
      post.likes--;
    } else {
      this.user.favourites.push(post.id);
      post.likes++;
    }
    this.postSvc.update(post).subscribe();
    this.userSvc.update(this.user).subscribe();
  }

  deleteComment(id: number) {
    this.commentSvc.delete(id).subscribe();
  }

  addComment(post: IPost) {
    const newDate = new Date()
    if (this.user && post) {
      const commentToAdd: Partial<IComment> = {
        ...this.newComments[post.id],
        userId: this.user.id,
        postId: post.id,
        date: newDate.getTime()
      };
      this.commentSvc.create(commentToAdd).subscribe(() => {
        this.newComments[post.id] = {};
      });
    }
  }

  toggleComments(index: number) {
    this.showComments[index] = !this.showComments[index];
  }

  filterPost(category: string) {
    this.postSvc.$post.subscribe((posts) => {
      this.posts = posts;
    });
    if (category === 'all') {
      return;
    }
    this.posts = this.posts.filter((p) => p.category === category);
  }

}
