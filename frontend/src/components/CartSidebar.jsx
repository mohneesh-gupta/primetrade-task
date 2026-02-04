import { useCart } from '../context/CartContext'

const CartSidebar = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, isCartOpen, setIsCartOpen } = useCart()

    if (!isCartOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span>🛒</span> Shopping Cart
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="text-6xl mb-4">🛒</div>
                            <p className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</p>
                            <p className="text-gray-600 mb-6">Add some products to get started!</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="flex gap-4">
                                        <img
                                            src={item.imageUrl || 'https://via.placeholder.com/100'}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">${item.price.toFixed(2)} each</p>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="w-7 h-7 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700"
                                                >
                                                    −
                                                </button>
                                                <span className="w-10 text-center font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-7 h-7 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                            <p className="text-lg font-bold text-blue-600">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t bg-gray-50 p-6 space-y-4">
                        <div className="flex items-center justify-between text-lg">
                            <span className="font-semibold text-gray-700">Subtotal:</span>
                            <span className="text-2xl font-bold text-blue-600">${getCartTotal().toFixed(2)}</span>
                        </div>
                        <button className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Proceed to Checkout
                        </button>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="w-full py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default CartSidebar
