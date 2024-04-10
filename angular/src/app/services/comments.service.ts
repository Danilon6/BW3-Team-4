import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { iComment } from '../models/i-comment';
import { BehaviorSubject, Observable, concatMap, switchMap, tap } from 'rxjs';
import { PostService } from './post.service';
import { environment } from '../../environments/environment.development';
import { iUser } from '../models/i-user';
import { iPost } from '../models/i-post';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  commentsUrl: string = environment.commentsUrl

  // COMMENTI ARR BEHAVIORSUBJECT E OBSERVABLE

  commentsArr: iComment[] = []

  commentsSubject = new BehaviorSubject<iComment[]>([])

  $comments = this.commentsSubject.asObservable()

  user!: iUser
  constructor(private http: HttpClient,
    private authSvc: AuthService,
    private postSvc: PostService) {
    this.postSvc.getAnything<iComment>(this.commentsUrl).subscribe(comments => {
      this.commentsSubject.next(comments)
      this.commentsArr = comments
    })

    this.authSvc.$user.subscribe(user => {
      if (user)
        this.user = user
    })

  }



  deleteComment(id: number): Observable<iComment> {
    return this.http.delete<iComment>(this.commentsUrl + `/${id}`)
      .pipe(tap(() => {
        this.commentsArr = this.commentsArr.filter(c => c.id != id)
        this.commentsSubject.next(this.commentsArr)
      }))

    // .pipe(tap((comment) => {
    //     this.commentsArr.push(comment)
    //     this.commentsSubject.next(this.commentsArr)
    //   }))
  }
  addComment(newComment: Partial<iComment>, post: iPost): Observable<iComment> {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('it-IT');
    return this.http.post<iComment>(this.commentsUrl, { ...newComment, userid: this.user.id, autore: this.user.name, data: formattedDate })
      .pipe(tap((data) => {

        // // Aggiungi l'ID del nuovo commento al post
        // post.commenti = [...post.commenti, data.id];
        // // Crea un nuovo array di post con il post modificato
        // const index = this.postSvc.postArr.findIndex(p => p.id == post.id)
        // const updatedpost = this.postSvc.postArr.splice(index, 1, post)

        // console.log(this.postSvc.postArr);
        // return this.http.put<iPost>(this.postSvc.postUrl + `/${post.id}`, updatedpost)
        //   .pipe(tap(post => {//ricevo lo user aggiornato

        //     this.postSvc.postSubject.next(updatedArr);

        //   }))
        // console.log(data);




        // Emetti il nuovo array di post tramite il subject

      }))

    // .pipe(tap((comment) => {
    //     this.commentsArr.push(comment)
    //     this.commentsSubject.next(this.commentsArr)
    //   }))
  }

  // removePost(id: number): Observable<iPost> {
  //   return this.http.delete<iPost>(this.postUrl + '/' + id)
  //     .pipe(tap(() => {
  //       this.postArr = this.postArr.filter(p => p.id != id)
  //       this.mypostSubject.next(this.postArr)
  //       this.postSubject.next(this.postArr)
  //     }))
  // }
}
