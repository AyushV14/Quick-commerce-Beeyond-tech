import { io } from 'socket.io-client'
import { getToken } from '../utils/jwt'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

let socket = null

export const initializeSocket = () => {
  const token = getToken()
  
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token
      }
    })

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })
  }

  return socket
}

export const getSocket = () => {
  if (!socket) {
    return initializeSocket()
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}