export interface iUser {
  id: number
  email: string
  password: string
  name: string
  myPostIds: number[]
  myFavoritePostIds: number[]
}
