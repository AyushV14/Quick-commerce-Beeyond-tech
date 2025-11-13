import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import OrderCard from '../../components/OrderCard'
import api from '../../api/axios'
import { getSocket } from '../../sockets/socket'

const DeliveryDashboard = () => {
  const [unassignedOrders, setUnassignedOrders] = useState([])
  const [myOrders, setMyOrders] = useState([])
  const [activeTab, setActiveTab] = useState('available')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUnassignedOrders()
    fetchMyOrders()

    const socket = getSocket()
    socket.emit('join_room', 'delivery')

    socket.on('new_order', (order) => {
      setUnassignedOrders((prev) => [order, ...prev])
    })

    socket.on('order_locked', (order) => {
      setUnassignedOrders((prev) => prev.filter((o) => o._id !== order._id))
    })

    socket.on('order_status_updated', (order) => {
      setMyOrders((prev) =>
        prev.map((o) => (o._id === order._id ? order : o))
      )
    })

    return () => {
      socket.off('new_order')
      socket.off('order_locked')
      socket.off('order_status_updated')
    }
  }, [])

  const fetchUnassignedOrders = async () => {
    try {
      const response = await api.get('/orders/unassigned')
      setUnassignedOrders(response.data)
    } catch (error) {
      console.error('Error fetching unassigned orders:', error)
    }
  }

  const fetchMyOrders = async () => {
    try {
      const response = await api.get('/orders/my-deliveries')
      setMyOrders(response.data)
    } catch (error) {
      console.error('Error fetching my orders:', error)
    }
  }

  const acceptOrder = async (orderId) => {
    setLoading(true)
    try {
      await api.post(`/orders/accept/${orderId}`)
      await fetchUnassignedOrders()
      await fetchMyOrders()
      setActiveTab('my-deliveries')
    } catch (error) {
      console.error('Error accepting order:', error)
      alert(error.response?.data?.message || 'Failed to accept order')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    setLoading(true)
    try {
      await api.patch(`/orders/update/${orderId}`, { status })
      await fetchMyOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
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
            onClick={() => setActiveTab('available')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'available'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Available Orders ({unassignedOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('my-deliveries')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'my-deliveries'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            My Deliveries ({myOrders.length})
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Available Orders</h2>
            {unassignedOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                No orders available at the moment
              </div>
            ) : (
              <div className="space-y-4">
                {unassignedOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onAccept={acceptOrder}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-deliveries' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">My Deliveries</h2>
            {myOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                No deliveries assigned yet
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliveryDashboard