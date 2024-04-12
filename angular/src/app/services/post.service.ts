import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IPost} from '../models/i-post';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postUrl: string = environment.postsUrl;

  constructor(private http: HttpClient, private router: Router) {
    this.getAll().subscribe();
  }

  posts: IPost[] = [];

  postSubject = new BehaviorSubject<IPost[]>([]); //entrata

  $post = this.postSubject.asObservable(); //uscita

  getAll(): Observable<IPost[]> {
    return this.http.get<IPost[]>(this.postUrl).pipe(
      tap((post) => {
        this.postSubject.next(post);
        this.posts = post;
      })
    );
  }

  getById(id: number): IPost | null {
    console.log(this.posts);

    return this.posts.find((u) => u.id == id) || null;
  }

  update(post: IPost) {
    return this.http.put<IPost>(this.postUrl + `/${post.id}`, post).pipe(
      tap((responseUser) => {
        //ricevo lo user aggiornato
        const index = this.posts.findIndex((p) => p.id == post.id);
        this.posts.splice(index, 1, responseUser);

        this.postSubject.next(this.posts);
      })
    );
  }

  create(post: Partial<IPost>) {
    return this.http.post<IPost>(this.postUrl, post).pipe(
      tap((responseUser) => {
        //ricevo lo user aggiornato

        this.posts.push(responseUser);
        this.postSubject.next(this.posts);
      })
    );
  }

  delete(id: number) {
    return this.http.delete<IPost>(this.postUrl + `/${id}`).pipe(
      tap(() => {
        const index = this.posts.findIndex((p) => p.id == id);
        this.posts.splice(index, 1);

        this.postSubject.next(this.posts);
      })
    );
  }

}
