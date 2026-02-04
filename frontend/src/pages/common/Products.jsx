import { useState, useEffect } from 'react'
import { productsAPI } from '../../services/api'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other']

const Products = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true)
      const params = { page, limit: 12 }
      if (category !== 'All') params.category = category
      if (search) params.search = search

      const response = await productsAPI.getAll(params)
      setProducts(response.data.data.products)
      setPagination(response.data.data.pagination)
    } catch (err) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [category])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Product Catalog</h1>
        <p className="text-blue-100">Browse our complete collection of products</p>
        {pagination.total > 0 && (
          <p className="text-sm text-blue-200 mt-2">
            {pagination.total} product{pagination.total !== 1 ? 's' : ''} available
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2.5 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 ${category === cat
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-lg font-medium mb-2">No products found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover bg-gradient-to-br from-gray-100 to-gray-200"
                  />
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Low Stock
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1 flex-1">{product.name}</h3>
                    <span className="text-xl font-bold text-blue-600 ml-2">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full font-semibold border border-blue-200">
                      {product.category}
                    </span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {product.stock > 0 ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {product.stock} in stock
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Out of stock
                        </>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full mt-4 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                      }`}
                  >
                    {product.stock === 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <button
                onClick={() => fetchProducts(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                ← Previous
              </button>
              <div className="px-6 py-2.5 bg-gray-100 rounded-lg">
                <span className="font-bold text-gray-900">
                  Page {pagination.current}
                </span>
                <span className="text-gray-500"> of {pagination.pages}</span>
              </div>
              <button
                onClick={() => fetchProducts(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products
