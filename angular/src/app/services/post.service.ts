import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { iPost } from '../models/i-post';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { iUser } from '../models/i-user';
import { iComment } from '../models/i-comment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  // POST ARR BEHAVIORSUBJECT E OBSERVABLE
  postArr: iPost[] = []

  postSubject = new BehaviorSubject<iPost[]>([])

  $post = this.postSubject.asObservable()


  // FAVORITE ARR BEHAVIORSUBJECT E OBSERVABLE
  favoriteIds: number[] = []
  favoritePostArr: iPost[] = []

  favoritePostSubject = new BehaviorSubject<iPost[]>([])

  $favoritePost = this.favoritePostSubject.asObservable()



  userId!: number

  mypostSubject = new BehaviorSubject<iPost[]>([])

  $myPost = this.mypostSubject.asObservable()

  constructor(
    private http: HttpClient,
    private authSvc: AuthService
  ) {
    this.getAnything<iPost>(this.postUrl).subscribe(posts => {
      this.postSubject.next(posts)
      this.postArr = posts

      this.authSvc.$user.subscribe(user => {
        if (user)
          this.favoriteIds = user?.myFavoritePostIds
        if (user) {
          this.userId = user?.id
        }
      }
      )


      const favoritePostArr = this.filterPosts(this.postArr, this.favoriteIds)

      this.favoritePostSubject.next(favoritePostArr);

      const myPost = this.filterPosts(this.postArr, this.userId)

      this.mypostSubject.next(myPost)
    })

  }

  postUrl: string = environment.postsUrl
  userUrl: string = environment.usersUrl


  getAnything<T>(apiUrl: string, attribute?: string, value?: string | number | boolean) {
    if (attribute && value) {
      return this.http.get<T[]>(`${apiUrl}?${attribute}=${value}`)
    }
    return this.http.get<T[]>(apiUrl)
  }

  filterPosts(postsArr: iPost[], ids: number[] | number): iPost[] {
    if (Array.isArray(ids)) {
      return postsArr.filter((post) => ids.includes(post.id))
    }
    return this.postArr.filter(post => post.userId == ids)
  }

  filterComment(commentsArr: iComment[], ids: number[]): iComment[] {
    return commentsArr.filter((comment) => ids.includes(comment.id))
  }


  addPost(newPost: Partial<iPost>): Observable<iPost> {
    const newPostObj = {...newPost, likes: 0}
    return this.http.post<iPost>(this.postUrl, newPostObj )
      .pipe(tap((post) => {
        this.postArr.push(post)
        this.postSubject.next(this.postArr)
      }))
  }

  removePost(id: number): Observable<iPost> {
    return this.http.delete<iPost>(this.postUrl + '/' + id)
      .pipe(tap(() => {
        this.postArr = this.postArr.filter(p => p.id != id)
        this.mypostSubject.next(this.postArr)
        this.postSubject.next(this.postArr)
      }))
  }


  editPost(editPost: iPost): Observable<iPost> {
    return this.http.put<iPost>(this.postUrl + "/" + editPost.id, editPost)
      .pipe(tap(() => {
        this.postArr = this.postArr.map(post => {
          if (post.id == editPost.id) {
            return { ...post, ...editPost }
          }
          return post
        })
        this.mypostSubject.next(this.postArr)
        this.postSubject.next(this.postArr)
      }))
  }


  addToFavorite(postId: number): Observable<iUser | null> {
    return this.http.get<iUser>(`${this.userUrl}/${this.userId}`).pipe(
      switchMap(user => {
        if (user.myFavoritePostIds) {
          if (!user.myFavoritePostIds.includes(postId)) {
            const updatedMyFavoritePostIds = [...user.myFavoritePostIds, postId];
            return this.http.put<iUser>(`${this.userUrl}/${user.id}`, { ...user, myFavoritePostIds: updatedMyFavoritePostIds })
              .pipe(tap(() => {
                this.favoritePostArr = [...this.favoritePostArr, this.postArr.find(post => post.id === postId)!]
                this.favoritePostSubject.next(this.favoritePostArr)
              }))
          }
          return of(null)
        }
        return this.http.put<iUser>(`${this.userUrl}/${user.id}`, { ...user, myFavoritePostIds: [postId] })
          .pipe(tap(() => {
            this.favoritePostArr = [...this.favoritePostArr, this.postArr.find(post => post.id === postId)!]
            this.favoritePostSubject.next(this.favoritePostArr)
          }))
      })
    );
  }

  removeFavorite(postId: number): Observable<iUser> {
    return this.http.get<iUser>(`${this.userUrl}/${this.userId}`).pipe(
      switchMap(user => {
        const updatedMyFavoritePostIds = user.myFavoritePostIds.filter(id => id !== postId)
        return this.http.put<iUser>(`${this.userUrl}/${user.id}`, { ...user, myFavoritePostIds: updatedMyFavoritePostIds })
          .pipe(tap(() => {
            this.favoritePostArr = [...this.favoritePostArr, this.postArr.find(post => post.id === postId)!]
            this.favoritePostSubject.next(this.favoritePostArr)
          }))
      })
    );
  }


  addLike(post: iPost) {
    if (!post) return
    return this.http.put<iPost>(`${this.postUrl}/${post.id}`, { ...post, likes: post.likes++ })
    // .pipe(tap(() =>{
    //   this.postArr = [...this.postArr, this.postArr.find(post => post.id === postId)!]
    //   this.postSubject.next(this.postArr)
    // }))
  }
  removeLike(post: iPost) {
    if (!post) return
    return this.http.put<iPost>(`${this.postUrl}/${post.id}`, { ...post, likes: post.likes-- }).pipe()
  }



}
