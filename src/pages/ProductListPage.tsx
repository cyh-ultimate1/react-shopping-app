import { useState } from 'react'
import type { ProductsResponse } from '../types'
import ProductCard from '../components/ProductCard'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useDebounce } from '../hooks/useDebounce'

function ProductListPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  type SortOrder = 'none' | 'asc' | 'desc'
  const [sort, setSort] = useState<SortOrder>('none')

  const PAGE_SIZE = 20

  function buildUrl(
    q: string,
    category: string,
    sort: SortOrder,
    skip: number,
  ) {
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      skip: String(skip),
    })
    if (sort !== 'none') {
      params.set('sortBy', 'price')
      params.set('order', sort)
    }

    if (q)
      return `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&${params}`
    if (category !== 'all')
      return `https://dummyjson.com/products/category/${category}?${params}`
    return `https://dummyjson.com/products?${params}`
  }

  const debouncedQuery = useDebounce(query, 400)
  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ['products'],
  //   queryFn: async ({ signal }) => {
  //     const res = await fetch('https://dummyjson.com/products?limit=0', {
  //       signal,
  //     })
  //     if (!res.ok) throw new Error(`HTTP ${res.status}`)
  //     return (await res.json()) as ProductsResponse
  //   },
  // })
  // const products = data?.products ?? []

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', { q: debouncedQuery, category, sort }],
    queryFn: async ({ pageParam, signal }) => {
      const res = await fetch(
        buildUrl(debouncedQuery, category, sort, pageParam),
        { signal },
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return (await res.json()) as ProductsResponse
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit
      return nextSkip < lastPage.total ? nextSkip : undefined
    },
  })

  const products = data?.pages.flatMap((page) => page.products) ?? []
  const total = data?.pages[0]?.total ?? 0

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async ({ signal }) => {
      const res = await fetch('https://dummyjson.com/products/category-list', {
        signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return (await res.json()) as string[]
    },
    staleTime: Infinity,
  })
  // const visibleProducts = products.filter((p) => {
  //   const matchesQuery = p.title
  //     .toLowerCase()
  //     .includes(query.trim().toLowerCase())
  //   const matchesCategory = category === 'all' || p.category === category
  //   return matchesQuery && matchesCategory
  // })
  // const sortedProducts =
  //   sort === 'none'
  //     ? visibleProducts
  //     : [...visibleProducts].sort((a, b) =>
  //         sort === 'asc' ? a.price - b.price : b.price - a.price,
  //       )

  return (
    <>
      <div className="toolbar">
        <input
          type="search"
          className="search-input"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {['all', ...categories].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
        >
          <option key={'none'} value={'none'}>
            Sort: default
          </option>
          <option key={'asc'} value={'asc'}>
            Price: low to high
          </option>
          <option key={'desc'} value={'desc'}>
            Price: high to low
          </option>
        </select>
      </div>

      {isLoading && <p className="state-message">Loading products...</p>}
      {isError && (
        <p className="state-message error-text">Error: {error.message}</p>
      )}
      {!isLoading && !isError && products.length === 0 && (
        <p className="state-message">No products match "{query}".</p>
      )}
      {!isLoading && !isError && products.length > 0 && (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      {hasNextPage && (
        <button
          className="btn btn-secondary"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load more'}
        </button>
      )}
      {!isLoading && (
        <p>
          Showing {products.length} of {total}
        </p>
      )}
    </>
  )
}

export default ProductListPage
