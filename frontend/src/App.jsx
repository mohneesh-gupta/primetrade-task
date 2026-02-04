import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import CartSidebar from './components/CartSidebar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Common Pages
import Home from './pages/common/Home'
import Products from './pages/common/Products'

// Admin Pages
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />

            {/* Common Routes (accessible to all) */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />

            {/* Admin Routes */}
            <Route path="/admin/products" element={
              <ProtectedRoute adminOnly>
                <AdminProducts />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </Router>
  )
}

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

export default App
