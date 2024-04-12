import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IComment,  } from '../models/i-comment';
import { BehaviorSubject, Observable, concatMap, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  commentUrl: string = environment.commentsUrl;

  constructor(private http: HttpClient) {
    this.getAll().subscribe();
  }

  comments: IComment[] = [];

  commentSubject = new BehaviorSubject<IComment[]>([]); //entrata

  $comment = this.commentSubject.asObservable(); //uscita

  getAll(): Observable<IComment[]> {
    return this.http.get<IComment[]>(this.commentUrl).pipe(
      tap((comment) => {
        this.commentSubject.next(comment);
        this.comments = comment;
      })
    );
  }

  getById(id: number): IComment | null {
    console.log(this.comments);

    return this.comments.find((c) => c.id == id) || null;
  }

  update(comment: IComment) {
    return this.http
      .put<IComment>(this.comments + `/${comment.id}`, comment)
      .pipe(
        tap((responseUser) => {
          //ricevo lo user aggiornato
          const index = this.comments.findIndex((c) => c.id == comment.id);
          this.comments.splice(index, 1, responseUser);

          this.commentSubject.next(this.comments);
        })
      );
  }

  create(comment: Partial<IComment>) {
    return this.http.post<IComment>(this.commentUrl, comment).pipe(
      tap((responseUser) => {
        //ricevo lo user aggiornato

        this.comments.push(responseUser);
        this.commentSubject.next(this.comments);
      })
    );
  }

  delete(id: number) {
    return this.http.delete<IComment>(this.commentUrl + `/${id}`).pipe(
      tap(() => {
        const index = this.comments.findIndex((p) => p.id == id);
        this.comments.splice(index, 1);

        this.commentSubject.next(this.comments);
      })
    );
  }
}
