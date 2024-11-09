interface Product {
  name: string
  image: string
  images: string[]
  description: string
  category: Category
  brand?: Brand
  // rating: number
  price: number
  price_before_discount: number
  quantity: number
  uses: string
  madeIn: string
  view: number
  sold: number
  status?: number
  comment: Comment[]
}
interface Category {
  name: string
}
interface Brand {
  name: string
  image: string
  description: string
}
interface Comment {
  user: User
  rating: number
  comment: string
}
