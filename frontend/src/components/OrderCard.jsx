import StatusBadge from './StatusBadge'

const OrderCard = ({ order, onAccept, onUpdateStatus, showActions }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
          <p className="text-gray-600 text-sm">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Items:</h4>
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm mb-1">
            <span>
              {item.productId?.name || 'Product'} x {item.quantity}
            </span>
            <span>${(item.productId?.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span className="text-blue-600">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {order.customerId && (
        <div className="text-sm text-gray-600 mb-4">
          <p>Customer: {order.customerId.name}</p>
          <p>Email: {order.customerId.email}</p>
        </div>
      )}

      {order.assignedTo && (
        <div className="text-sm text-gray-600 mb-4">
          <p>Delivery Partner: {order.assignedTo.name}</p>
        </div>
      )}

      {showActions && (
        <div className="space-y-2">
          {order.status === 'pending' && onAccept && (
            <button
              onClick={() => onAccept(order._id)}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Accept Order
            </button>
          )}

          {order.status === 'accepted' && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(order._id, 'picked_up')}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Mark as Picked Up
            </button>
          )}

          {order.status === 'picked_up' && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(order._id, 'on_the_way')}
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Mark as On The Way
            </button>
          )}

          {order.status === 'on_the_way' && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(order._id, 'delivered')}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderCard