const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { initializeSocket } = require('./sockets/orderSocket');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

connectDB();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/products', customerRoutes);
app.use('/orders', customerRoutes);
app.use('/orders', deliveryRoutes);
app.use('/admin', adminRoutes);

initializeSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});