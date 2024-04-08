export interface iPost {
  id: number,
  slug:string,
  userid: number
  titolo: string
  autore: string
  contenuto: string
  data_pubblicazione: string
  categoria: string
  likes: number
  commenti: number[]
}
