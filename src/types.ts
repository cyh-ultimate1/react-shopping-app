export type Product = {
  id: number
  title: string
  price: number
  description: string
  category: string
  thumbnail: string
  images: string[]
  rating: number
  stock: number
  brand?: string
}

export type ProductsResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}
