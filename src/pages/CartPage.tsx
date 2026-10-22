import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'

function CartPage() {
  const { items, removeItem, totalCount, totalPrice, clear, setQuantity } =
    useCart()
  const onClearCart = () => clear()

  if (items.length <= 0) {
    return (
      <div className="state-message">
        <p>Your cart is empty.</p>
        <Link to="/" className="btn btn-secondary">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <>
      <h2>Your cart</h2>

      <div className="table-scroll">
        <table className="cart-table">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col" className="num">
                Price
              </th>
              <th scope="col">Quantity</th>
              <th scope="col" className="num">
                Subtotal
              </th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.product.id}>
                <td>
                  <div className="cart-product">
                    <img src={item.product.thumbnail} alt="" />
                    <span>{item.product.title}</span>
                  </div>
                </td>
                <td className="num">${item.product.price.toFixed(2)}</td>
                <td>
                  <div className="stepper">
                    <button
                      aria-label={`Decrease quantity of ${item.product.title}`}
                      onClick={() =>
                        setQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Increase quantity of ${item.product.title}`}
                      onClick={() =>
                        setQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="num">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(item.product.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-panel">
        <div className="summary-row">
          <span>Items</span>
          <span>{totalCount}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <Link to={'/checkout'} className="btn btn-primary btn-block">
          Checkout
        </Link>
        <button className="btn btn-secondary btn-block" onClick={onClearCart}>
          Clear Cart
        </button>
      </div>
    </>
  )
}

export default CartPage
