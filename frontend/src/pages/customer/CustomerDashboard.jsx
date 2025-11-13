import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import ProductCard from '../../components/ProductCard'
import OrderCard from '../../components/OrderCard'
import api from '../../api/axios'
import { getSocket } from '../../sockets/socket'

const CustomerDashboard = () => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchMyOrders()
    
    const socket = getSocket()
    socket.emit('join_room', 'customer')

    socket.on('order_accepted', (order) => {
      setOrders((prev) => 
        prev.map((o) => (o._id === order._id ? order : o))
      )
    })

    socket.on('order_status_updated', (order) => {
      setOrders((prev) => 
        prev.map((o) => (o._id === order._id ? order : o))
      )
    })

    return () => {
      socket.off('order_accepted')
      socket.off('order_status_updated')
    }
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchMyOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.productId === product._id)
    
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { productId: product._id, product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId)
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }

  const placeOrder = async () => {
    if (cart.length === 0) return

    setLoading(true)
    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        total: calculateTotal()
      }

      await api.post('/orders', orderData)
      setCart([])
      fetchMyOrders()
      setActiveTab('orders')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'cart'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cart ({cart.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            My Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between border-b py-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{item.product.name}</h3>
                          <p className="text-gray-600">${item.product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between text-xl font-bold mb-4">
                      <span>Total:</span>
                      <span className="text-blue-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <button onClick={placeOrder}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-green-400"
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                No orders yet
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} showActions={false} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerDashboard