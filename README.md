# ShopEasy

A shopping app built with React and TypeScript, made as a hands-on learning project.
Browse and search products, view details, manage a cart, and check out.

**Live demo:** [Demo site](https://react-shopping-app-sigma.vercel.app/)

## Features

- Product catalogue with **search, category filter and price sort**, all handled server-side
- **"Load more" pagination** over 194 products
- Product detail pages with shareable URLs
- Shopping cart with quantity controls, **saved across page refreshes**
- Checkout form with **validation** and an order confirmation
- Responsive layout with automatic light/dark mode

## Tech stack

React 19 · TypeScript · Vite · React Router · TanStack Query · React Hook Form · Zod · pnpm · Prettier · oxlint · Vercel

Product data comes from [DummyJSON](https://dummyjson.com). Orders are sent to a mock endpoint and are not stored.

## Concepts demonstrated

**React fundamentals**
- Components and typed props, lists and keys, conditional rendering
- `useState`, `useEffect` with cleanup, `useMemo`
- Derived state: values are calculated from state rather than stored twice

**State management**
- Shared cart state with **Context**, accessed through a custom `useCart()` hook
- Immutable updates and the updater form `setX(prev => ...)`
- `localStorage` persistence with a lazy `useState` initializer

**Data fetching (TanStack Query)**
- `useQuery` for reads with caching, request de-duplication and `staleTime`
- `useInfiniteQuery` for paginated "Load more"
- `useMutation` for submitting orders
- Query keys that include every filter, so each combination is cached separately
- Search debounced with a custom generic `useDebounce<T>` hook

**Forms**
- React Hook Form with Zod schema validation
- The form's TypeScript type is derived from the schema with `z.infer`

**TypeScript**
- Generics, literal types and type inference
- A **discriminated union** for checkout state, so invalid combinations can't be written

**Routing and deployment**
- Client-side routing with URL parameters (`/products/:id`)
- Deployed on Vercel with an SPA rewrite, so deep links and page refreshes work

**Accessibility**
- The cart is a semantic `<table>` with `scope` headers, screen-reader-only labels and `aria-label`s

## Project structure

```
src/
  cart/        CartContext - cart state, provider and useCart hook
  components/  ProductCard, CartBadge
  hooks/       useDebounce
  pages/       ProductList, ProductDetail, Cart, Checkout
  types.ts     shared API types
```

## Running locally

```bash
pnpm install
pnpm dev
```

Other scripts: `pnpm build` · `pnpm lint` · `pnpm format`
