import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import DeliveryDashboard from './pages/delivery/DeliveryDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={`/${user.role}`} /> : <Register />} />
        
        <Route 
          path="/customer" 
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/delivery" 
          element={
            <ProtectedRoute allowedRoles={['delivery']}>
              <DeliveryDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App