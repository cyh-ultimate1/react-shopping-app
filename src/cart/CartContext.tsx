import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types'

// one line in the cart: a product + how many
export type CartItem = {
  product: Product
  quantity: number
}

// everything the rest of the app can do with the cart
type CartContextValue = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  setQuantity: (productId: number, quantity: number) => void
  clear: () => void
  totalCount: number // sum of all quantities
  totalPrice: number // sum of price * quantity
}

// undefined default — see the hook below for why
const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cart')
      return stored ? (JSON.parse(stored) as CartItem[]) : []
    } catch {
      return []
    }
  })

  function addItem(product: Product, quantity = 1) {
    // - if this product is already in `items`, increase its quantity
    // - otherwise append a new { product, quantity }
    // - must be IMMUTABLE: build a new array, don't push into the old one
    setItems((prev) =>
      prev.some((it) => it.product.id === product.id)
        ? prev.map((it) =>
            it.product.id === product.id
              ? { ...it, quantity: it.quantity + quantity }
              : it,
          )
        : [...prev, { product: product, quantity: quantity }],
    )
  }

  function removeItem(productId: number) {
    // return items without the one whose product.id === productId
    setItems((prev) => prev.filter((it) => it.product.id !== productId))
  }

  function setQuantity(productId: number, quantity: number) {
    // if quantity <= 0, remove it; otherwise map and replace that item's quantity
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      setItems((prev) =>
        prev.map((it) =>
          it.product.id === productId ? { ...it, quantity: quantity } : it,
        ),
      )
    }
  }

  function clear() {
    setItems([])
  }

  // derived values — recomputed when `items` changes
  const totalCount = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items],
  )
  const totalPrice = useMemo(
    () => items.reduce((sum, it) => sum + it.product.price * it.quantity, 0),
    [items],
  )

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    setQuantity,
    clear,
    totalCount,
    totalPrice,
  }

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// the hook every component uses instead of raw useContext
export function useCart() {
  const ctx = useContext(CartContext)
  if (ctx === undefined) {
    throw new Error('useCart must be used inside a <CartProvider>')
  }
  return ctx
}
