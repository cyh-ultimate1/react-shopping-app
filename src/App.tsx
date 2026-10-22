import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import { CartProvider } from './cart/CartContext'
import CartBadge from './components/CartBadge'
import CartPage from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <header className="site-header">
          <div className="container">
            <Link to="/" className="brand">
              🛍️ ShopEasy
            </Link>
            <nav className="nav">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <CartBadge />
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
