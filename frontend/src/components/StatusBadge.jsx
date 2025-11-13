const StatusBadge = ({ status }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    picked_up: 'bg-purple-100 text-purple-800',
    on_the_way: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800'
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  )
}

export default StatusBadge