import { useParams, Link } from 'react-router-dom'
import type { Product } from '../types'
import { useQuery } from '@tanstack/react-query'

function ProductDetailPage() {
  const { id } = useParams()
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async ({ signal }) => {
      const res = await fetch(`https://dummyjson.com/products/${id}`, {
        signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return (await res.json()) as Product
    },
    enabled: !!id,
  })

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to list
      </Link>

      {isLoading && <p className="state-message">Loading ...</p>}
      {isError && (
        <p className="state-message error-text">Error: {error.message}</p>
      )}
      {!isLoading && !isError && product && (
        <div className="detail">
          <div className="detail-image">
            <img src={product.thumbnail} alt={product.title} />
          </div>
          <div className="detail-info">
            <span className="category-tag">{product.category}</span>
            <h2>{product.title}</h2>
            <span className="price">${product.price.toFixed(2)}</span>
            <p>{product.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
