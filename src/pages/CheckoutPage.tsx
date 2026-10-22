import { useState } from 'react'
import { useCart } from '../cart/CartContext'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const checkoutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  address: z.string().min(1, 'Address is required'),
})

type CheckoutForm = z.infer<typeof checkoutSchema>
type CheckoutState =
  { status: 'editing' } | { status: 'placed'; name: string; total: number }

export function CheckoutPage() {
  const { items, totalPrice, clear } = useCart()
  const [checkout, setCheckout] = useState<CheckoutState>({ status: 'editing' })

  const placeOrder = useMutation({
    mutationFn: async (order: {
      name: string
      email: string
      address: string
      total: number
    }) => {
      const res = await fetch('https://fakestoreapi.com/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return (await res.json()) as { id: number }
    },
    onSuccess: (data, variables) => {
      // runs only if mutationFn resolved without throwing
      setCheckout({
        status: 'placed',
        name: variables.name,
        total: variables.total,
      })
      clear()
      console.log('server order id:', data.id)
    },
    onError: (err) => {
      // runs if mutationFn threw
      console.error(err)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  })

  function onSubmit(values: CheckoutForm) {
    placeOrder.mutate({ ...values, total: totalPrice })
  }

  // guard 1: nothing in the cart, and no order placed yet
  if (checkout.status === 'editing' && items.length === 0) {
    return (
      <div className="state-message">
        <p>Your cart is empty — nothing to check out.</p>
        <Link to="/" className="btn btn-secondary">
          Browse products
        </Link>
      </div>
    )
  }

  // guard 2: order placed — show confirmation
  if (checkout.status === 'placed') {
    return (
      <div className="confirmation">
        <h2>Thanks, {checkout.name}!</h2>
        <p>Your order totalling ${checkout.total.toFixed(2)} is confirmed.</p>
        <Link to={'/'} className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="checkout-layout">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label>Name: </label>
          <input {...register('name')} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <div className="field">
          <label>Email: </label>
          <input {...register('email')} />
          {errors.email && (
            <p className="field-error">{errors.email.message}</p>
          )}
        </div>
        <div className="field">
          <label>Address: </label>
          <input {...register('address')} />
          {errors.address && (
            <p className="field-error">{errors.address.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={placeOrder.isPending}
        >
          {placeOrder.isPending ? 'Placing order…' : 'Place Order'}
        </button>
        {placeOrder.isError && (
          <p className="field-error">{placeOrder.error.message}</p>
        )}
      </form>

      <div className="summary-panel">
        <h2>Order summary</h2>
        <ul className="stack">
          {items.map((item) => (
            <li key={item.product.id} className="summary-row">
              <span>
                {item.product.title} × {item.quantity}
              </span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="summary-row total">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
