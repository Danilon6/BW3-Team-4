export interface iPost {
  id: number,
  slug:string,
  titolo: string
  autore: string
  contenuto: string
  data_pubblicazione: string
  categoria: string
  likes: number
  commenti: number[]
}
