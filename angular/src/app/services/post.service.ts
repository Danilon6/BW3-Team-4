import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { iPost } from '../models/i-post';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postArr:iPost[] =[]

  postSubject = new BehaviorSubject<iPost[]>([])

  $post = this.postSubject.asObservable()

  favoriteIds:number[] = []

  favoritePostArr:iPost[] = []

  favoritePostSubject = new BehaviorSubject<iPost[]>([])

  $favoritePost = this.favoritePostSubject.asObservable()

  userId!: number

  mypostSubject = new BehaviorSubject<iPost[]>([])

  $myPost = this.mypostSubject.asObservable()

  constructor(
    private http:HttpClient,
    private authSvc:AuthService
  ) {
    this.getAnything<iPost>(this.postUrl).subscribe(posts => {
      this.postSubject.next(posts)
      this.postArr = posts

      this.authSvc.$user.subscribe(user =>{
        if (user)
          this.favoriteIds = user?.myFavoritePostIds
        if (user) {
          this.userId = user?.id
        }
      }

    )

      const favoritePostArr = this.filterPosts(this.postArr, this.favoriteIds)

      this.favoritePostSubject.next(favoritePostArr);

      const myPost = this.filterPosts(this.postArr, this.userId )

      this.mypostSubject.next(myPost)
    })

  }

  postUrl:string = environment.postsUrl

getAnything<T>(apiUrl:string,attribute?:string, value?:string|number|boolean){
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



  }
