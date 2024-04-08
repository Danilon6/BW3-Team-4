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
      })

      this.getFavorites()
    })

  }

  postUrl:string = environment.postsUrl

getAnything<T>(apiUrl:string,attribute?:string, value?:string|number|boolean){
  if (attribute && value) {
    return this.http.get<T[]>(`${apiUrl}?${attribute}=${value}`)
  }
    return this.http.get<T[]>(apiUrl)
}

  getFavorites(){
      this.favoritePostArr = this.postArr.filter(post => this.favoriteIds?.includes(post.id));
      this.favoritePostSubject.next(this.favoritePostArr);
      return this.favoritePostArr
    }
  }
