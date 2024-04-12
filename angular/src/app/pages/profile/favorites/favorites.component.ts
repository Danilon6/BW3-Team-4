import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { IPost } from '../../../models/i-post';
import {PostService } from '../../../services/post.service';
import { CommentsService } from '../../../services/comments.service';
import { UserService } from '../../../services/user.service';
import { IComment } from '../../../models/i-comment';
import { IUser } from '../../../models/i-user';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
  user: IUser | undefined;
  posts: IPost[] = [];
  comments: IComment[] = [];
  users: IUser[] = [];

  newComment: Partial<IComment> = {};
  newComments: { [postId: number]: Partial<IComment> } = {};
  showComments: boolean[] = [];
  constructor(
    private authSvc: AuthService,
    private postSvc: PostService,
    private commentSvc: CommentsService,
    private userSvc: UserService
  ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      this.user = user || undefined;
    });

    this.postSvc.$post.subscribe((posts) => {
      this.posts = posts;
      this.posts = this.filterPostsByFavourites(this.posts, this.user!);
      this.posts.forEach((post) => {
        this.newComments[post.id] = {};
      });
    });

    this.commentSvc.$comment.subscribe((comments) => {
      this.comments = comments;
    });

    this.userSvc.users$.subscribe((users) => {
      this.users = users;
    });
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
    if (this.user && post) {
      const commentToAdd: Partial<IComment> = {
        ...this.newComments[post.id],
        userId: this.user.id,
        postId: post.id,
      };
      this.commentSvc.create(commentToAdd).subscribe(() => {
        this.newComments[post.id] = {};
      });
    }
  }

  toggleComments(index: number) {
    this.showComments[index] = !this.showComments[index];
  }

  filterPostsByFavourites(posts: IPost[], user: IUser): IPost[] {
    if (!user || !user.favourites || user.favourites.length === 0) {
      return [];
    }

    return posts.filter((post) => user.favourites.includes(post.id));
  }

  logout(){
    this.authSvc.logout()
  }

}
