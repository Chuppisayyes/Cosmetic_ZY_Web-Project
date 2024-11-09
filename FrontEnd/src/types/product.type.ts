export interface Product {
  _id: string
  name: string
  image: string
  images: string[]
  description: string
  category: { _id: string; name: string }
  brand: { _id: string; name: string; image: string; description: string }
  rating: number
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

export interface Comment {
  rating: number
  user: UserComment
  commentItem: string
  date: string
}
export interface UserComment {
  email: string
}
export interface ProductList {
  products: Product[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}

export interface ProductListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
  order?: 'asc' | 'desc'
  exclude?: string
  rating_filter?: number | string
  price_max?: number | string
  price_min?: number | string
  name?: string
  category?: string
  brand?: string
}
