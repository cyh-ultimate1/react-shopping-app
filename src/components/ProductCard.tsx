import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useCart } from '../cart/CartContext'

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const [qty, setQty] = useState(0)
  const onDecreaseStock = () => {
    setQty((prev) => Math.max(0, prev - 1))
  }
  const onIncreaseStock = () => setQty((prev) => prev + 1)
  const onAddToCart = () => {
    if (qty > 0) addItem(product, qty || 1) // qty is 0 by default; add at least 1
  }
  const { addItem } = useCart()

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-image">
          <img src={product.thumbnail} alt={product.title} />
        </div>
        <span className="category-tag">{product.category}</span>
        <h2 className="product-title">{product.title}</h2>
        <span className="price">${product.price.toFixed(2)}</span>
      </Link>

      <div className="card-actions">
        <div className="stepper">
          <button onClick={onDecreaseStock} aria-label="Decrease quantity">
            -
          </button>
          <span>{qty}</span>
          <button onClick={onIncreaseStock} aria-label="Increase quantity">
            +
          </button>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onAddToCart}>
          Add to cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
