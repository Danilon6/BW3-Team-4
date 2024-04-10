export interface iUser {
  id: number
  slug:string
  email: string
  password: string
  name: string
  myPostIds: number[]
  myFavoritePostIds: number[]
}
