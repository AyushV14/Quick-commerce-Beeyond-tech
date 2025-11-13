import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import OrderCard from '../../components/OrderCard'
import api from '../../api/axios'
import { getSocket } from '../../sockets/socket'

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [deliveryPartners, setDeliveryPartners] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalCustomers: 0,
    totalDeliveryPartners: 0
  })

  useEffect(() => {
    fetchAllOrders()
    fetchCustomers()
    fetchDeliveryPartners()

    const socket = getSocket()
    socket.emit('join_room', 'admin')

    socket.on('order_created', (order) => {
      setOrders((prev) => [order, ...prev])
      calculateStats([order, ...orders])
    })

    socket.on('order_accepted', (order) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)))
    })

    socket.on('order_status_updated', (order) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)))
      calculateStats(orders.map((o) => (o._id === order._id ? order : o)))
    })

    return () => {
      socket.off('order_created')
      socket.off('order_accepted')
      socket.off('order_status_updated')
    }
  }, [])

  const fetchAllOrders = async () => {
    try {
      const response = await api.get('/admin/orders')
      setOrders(response.data)
      calculateStats(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/admin/customers')
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchDeliveryPartners = async () => {
    try {
      const response = await api.get('/admin/delivery-partners')
      setDeliveryPartners(response.data)
    } catch (error) {
      console.error('Error fetching delivery partners:', error)
    }
  }

  const calculateStats = (ordersList) => {
    setStats({
      totalOrders: ordersList.length,
      pendingOrders: ordersList.filter((o) => o.status === 'pending').length,
      deliveredOrders: ordersList.filter((o) => o.status === 'delivered').length,
      totalCustomers: customers.length,
      totalDeliveryPartners: deliveryPartners.length
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Delivered</h3>
            <p className="text-3xl font-bold text-green-600">{stats.deliveredOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Customers</h3>
            <p className="text-3xl font-bold text-purple-600">{customers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Delivery Partners</h3>
            <p className="text-3xl font-bold text-orange-600">{deliveryPartners.length}</p>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'customers'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'delivery'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Delivery Partners
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">All Orders</h2>
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

        {activeTab === 'customers' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">All Customers</h2>
            {customers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                No customers yet
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">All Delivery Partners</h2>
            {deliveryPartners.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                No delivery partners yet
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deliveryPartners.map((partner) => (
                      <tr key={partner._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{partner.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{partner.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(partner.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard