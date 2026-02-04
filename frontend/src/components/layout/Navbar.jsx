import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth()
    const { getCartCount, setIsCartOpen } = useCart()
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
        setMobileMenuOpen(false)
    }

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
    ]

    const adminNavigation = [
        { name: 'Manage Products', href: '/admin/products' },
        { name: 'Manage Users', href: '/admin/users' },
    ]

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                            <span className="text-white text-xl font-bold">PT</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
                            PrimeTrade
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                        {isAdmin && adminNavigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {/* Cart Icon */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </button>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {isAdmin && (
                                <>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Admin</div>
                                    {adminNavigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors font-medium"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </>
                            )}

                            {/* Mobile Auth Section */}
                            <div className="pt-4 border-t border-gray-200 mt-4">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-2 text-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-semibold border-2 border-gray-300"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md font-semibold"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
