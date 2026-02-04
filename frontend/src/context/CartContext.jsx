import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item._id === product._id)
            if (existingItem) {
                toast.success(`Increased quantity of ${product.name}`)
                return prevCart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            toast.success(`Added ${product.name} to cart`)
            return [...prevCart, { ...product, quantity: 1 }]
        })
        setIsCartOpen(true)
    }

    const removeFromCart = (productId) => {
        const item = cart.find(i => i._id === productId)
        if (item) {
            toast.success(`Removed ${item.name} from cart`)
        }
        setCart((prevCart) => prevCart.filter((item) => item._id !== productId))
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === productId ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setCart([])
        toast.success('Cart cleared')
    }

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0)
    }

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        setIsCartOpen
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
