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

  user!:iUser
  constructor(private http: HttpClient,
    private authSvc: AuthService,
    private postSvc: PostService) {
    this.postSvc.getAnything<iComment>(this.commentsUrl).subscribe(comments => {
      this.commentsSubject.next(comments)
      this.commentsArr = comments
    })

    this.authSvc.$user.subscribe(user =>{
      if(user)
      this.user = user
    })

  }



  addComment(newComment: Partial<iComment>, post:iPost): Observable<iComment> {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('it-IT');
    return this.http.post<iComment>(this.commentsUrl, {...newComment, userid: this.user.id, autore: this.user.name, data: formattedDate})
    .pipe(tap((data)=>{
      console.log(data);

       // Aggiungi l'ID del nuovo commento al post
       post.commenti = [...post.commenti, data.id];
       // Crea un nuovo array di post con il post modificato
       const updatedPosts = this.postSvc.postArr.map(existingPost => existingPost.id === post.id ? post : existingPost);
       // Assegna il nuovo array di post all'array di post del servizio
       this.postSvc.postArr = updatedPosts;
       // Emetti il nuovo array di post tramite il subject
       this.postSvc.postSubject.next(updatedPosts);

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
