import { Component } from '@angular/core';
import { IPost } from '../../../models/i-post';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../auth/auth.service';
import { IUser } from '../../../models/i-user';
import { IComment } from '../../../models/i-comment';
import { CommentsService } from '../../../services/comments.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent {

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
      this.posts = this.filterMyPost(this.posts, this.user!);
    });

    this.commentSvc.$comment.subscribe((comments) => {
      this.comments = comments;
    });

    this.userSvc.users$.subscribe((users) => {
      this.users = users;
    });
  }
  deletePost(id: number) {
    this.postSvc.delete(id).subscribe();
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

  filterMyPost(posts: IPost[], user: IUser): IPost[] {
    if (!user || !user.favourites || user.favourites.length === 0) {
      // Se l'utente non esiste o non ha preferiti, restituisci un array vuoto
      return [];
    }

    // Filtra gli elementi dell'array posts in base agli id contenuti nell'array favourites dell'utente
    return posts.filter((post) => post.authorId === user.id);
  }

  logout(){
    this.authSvc.logout()
  }
}
