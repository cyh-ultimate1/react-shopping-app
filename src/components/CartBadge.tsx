import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'

function CartBadge() {
  const { totalCount } = useCart()
  return (
    <Link to="/cart" className="cart-badge">
      🛒 Cart ({totalCount})
    </Link>
  )
}

export default CartBadge
