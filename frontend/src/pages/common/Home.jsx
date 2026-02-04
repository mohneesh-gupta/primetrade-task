import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { productsAPI } from '../../services/api'

const Home = () => {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productsAPI.getAll({ limit: 4 })
        setFeaturedProducts(response.data.data.products)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-16 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to <span className="text-yellow-300">PrimeTrade</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl">
            Your trusted marketplace for quality products at unbeatable prices. Shop with confidence!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
            >
              🛍️ Shop Now
            </Link>
            {!user && (
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-blue-400 text-center"
              >
                Join Free Today
              </Link>
            )}
          </div>
        </div>
      </div>


      {/* Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-1">Handpicked items just for you</p>
          </div>
          <Link
            to="/products"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all transform hover:-translate-y-2 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Only {product.stock} left!
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                    <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold">
                      {product.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${product.stock === 0
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
        )}
      </div>

      {/* Categories */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Electronics', icon: '💻', color: 'from-blue-500 to-cyan-500' },
            { name: 'Clothing', icon: '👕', color: 'from-purple-500 to-pink-500' },
            { name: 'Books', icon: '📚', color: 'from-green-500 to-emerald-500' },
            { name: 'Home', icon: '🏠', color: 'from-orange-500 to-red-500' },
            { name: 'Sports', icon: '⚽', color: 'from-yellow-500 to-orange-500' },
            { name: 'Other', icon: '🎁', color: 'from-indigo-500 to-purple-500' }
          ].map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name}`}
              className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-2 border-2 border-gray-200 hover:border-blue-300 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="text-3xl">{category.icon}</span>
              </div>
              <p className="font-bold text-gray-900">{category.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Features/Benefits */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Shop With Us?</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all shadow-sm hover:shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">🚚</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">Get your orders delivered quickly and safely to your doorstep</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 transition-all shadow-sm hover:shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Quality Guaranteed</h3>
            <p className="text-sm text-gray-600">100% authentic products with quality assurance</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm hover:shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-sm text-gray-600">Your transactions are safe and encrypted</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 transition-all shadow-sm hover:shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-sm text-gray-600">Our team is always here to help you</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers. Create your free account today and get exclusive deals!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-purple-600 hover:bg-purple-50 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign Up Free
            </Link>
            <Link
              to="/products"
              className="px-8 py-4 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-purple-400"
            >
              Browse Products
            </Link>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap justify-center items-center gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">1000+</p>
            <p className="text-sm text-gray-600 mt-1">Products</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-gray-300"></div>
          <div>
            <p className="text-3xl font-bold text-green-600">5000+</p>
            <p className="text-sm text-gray-600 mt-1">Happy Customers</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-gray-300"></div>
          <div>
            <p className="text-3xl font-bold text-purple-600">24/7</p>
            <p className="text-sm text-gray-600 mt-1">Support</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-gray-300"></div>
          <div>
            <p className="text-3xl font-bold text-orange-600">100%</p>
            <p className="text-sm text-gray-600 mt-1">Secure</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
