


# 🚀 Real-Time Quick Commerce Application

A full-stack real-time delivery and order management system built with **React, Node.js, Express, MongoDB, and Socket.IO**, deployed on **AWS EC2** using Docker containers.

**Project Banner**

<img width="1904" height="978" alt="image" src="https://github.com/user-attachments/assets/05503250-5a7b-4846-ad78-b4e34b100a7e" />

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Live Demo](#live-demo)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [AWS EC2 Deployment](#aws-ec2-deployment)
- [WebSocket Flow](#websocket-flow)
- [Scaling Plan](#scaling-plan)
- [Screenshots](#screenshots)
- [Demo Video](#demo-video)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Project Overview

A production-ready **quick commerce application** enabling real-time order tracking between **customers**, **delivery partners**, and **administrators**.  

### Key Features
- **Customer Portal**: Browse products, place orders, track deliveries in real-time
- **Delivery Partner Dashboard**: Accept orders, update delivery status
- **Admin Dashboard**: Monitor all orders, users, and deliveries
- **Real-Time Updates**: Socket.IO-powered live order tracking
- **Secure Authentication**: JWT-based role-based access control

---

Project demo : http://35.175.180.138

---

## 🎥 Demo Video

[Watch Demo](https://drive.google.com/file/d/1n5IFsciuKdo3UZ4LhgW5j6OJwm2oxWNf/view?usp=sharing)

---

## 🌐 Live Demo

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://35.175.180.138 | Customer/Delivery/Admin dashboards |
| **Backend API** | http://35.175.180.138/api | REST API endpoints |
| **WebSocket** | ws://35.175.180.138/socket.io | Real-time communication |
| **Health Check** | http://35.175.180.138/api/health | API health status |

### Test Credentials

**Customer Account:**
```

Email: customer1@gmail.com
Password: customer123

```

**Delivery Partner Account:**
```

Email: delivery1@gmail.com
Password: delivery123

```

**Admin Account:**
```

Email: admin@gmail.com
Password: admin123

```

---

## 🏗️ System Architecture


<img width="1299" height="452" alt="diagram-export-11-14-2025-4_45_47-PM" src="https://github.com/user-attachments/assets/252d9824-7c3d-464d-8e96-453247f05118" />




**Flow**:
1. Frontend served via Nginx
2. API calls proxied to backend
3. WebSocket connections upgraded through Nginx
4. Backend interacts with MongoDB
5. Socket.IO broadcasts events to clients

---

## 🛠️ Tech Stack

**Frontend**: React 18, Vite, TailwindCSS, Axios, Socket.IO Client  
**Backend**: Node.js 18, Express.js, MongoDB, Mongoose, Socket.IO, JWT  
**DevOps**: Docker, Docker Compose, Nginx, AWS EC2  
**Security**: JWT Auth, Role-based access, bcrypt, CORS, Security headers

---

## ✨ Features

**Customer**
- Browse products, add to cart, place orders
- Real-time order tracking

**Delivery Partner**
- View & accept orders (locking mechanism)
- Update order status in real-time

**Admin**
- Monitor all orders & users
- Real-time activity tracking

**Technical**
- Real-time WebSocket communication
- JWT authentication & protected routes
- Dockerized deployment
- Nginx reverse proxy
- Responsive UI

---

## 📁 Folder Structure

```

quick-commerce-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── vite.config.js
├── docker-compose.yml
├── nginx.conf
├── .env.example
└── README.md

````

---

## 📋 Prerequisites

- **Local Development**: Node.js 18+, MongoDB, Git  
- **Deployment**: AWS EC2 (Ubuntu 22.04 LTS), Docker, Docker Compose

---

## 💻 Local Development Setup

1. Clone repo:
```bash
git clone https://github.com/AyushV14/Quick-commerce-Beeyond-tech.git
cd quick-commerce-app
````

2. Setup backend:

```bash
cd backend
npm install
cp .env.example .env
nano .env
npm run dev
```

3. Setup frontend:

```bash
cd ../frontend
npm install
nano .env
npm run dev
```

4. Add sample products via MongoDB shell.

5. Open browser: `http://localhost:3000`

---

## 🚀 AWS EC2 Deployment

1. Launch EC2 Ubuntu instance, configure security group (22, 80, 443, 5000)
2. SSH and install Docker & Docker Compose
3. Clone repo, configure `.env` files (backend + frontend)
4. Build and run containers:

```bash
docker-compose build --no-cache
docker-compose up -d
```

5. Test: `http://YOUR-EC2-PUBLIC-IP`

---

## 🔌 WebSocket Flow

**Events**:

* `order_created`: Admin notification
* `new_order`: Delivery partners notification
* `order_accepted`: Customer + Admin update
* `order_locked`: Prevent double assignment
* `order_status_updated`: Real-time delivery tracking

**Status Flow**: `pending → accepted → picked_up → on_the_way → delivered`

---

## 📈 Scaling Plan

### Redis Adapter for Socket.IO

* Horizontal scaling using multiple backend instances
* Redis Pub/Sub to sync events across instances

### Load Balancer

* AWS ALB / NLB to distribute traffic
* Sticky sessions for WebSocket

**Future**: Kubernetes deployment with replicas for backend/frontend, Redis, and MongoDB

---

## 🖼️ Screenshots

### Customer Dashboard
<img width="717" alt="customer-dashboard" src="https://github.com/user-attachments/assets/0e836f04-1020-4b89-a3cf-c59cd3f2a696" />

### Delivery Partner Dashboard
<img width="1919" alt="delivery-dashboard" src="https://github.com/user-attachments/assets/083aa80b-90bb-490b-b84f-1b41db838319" />

### Admin Dashboard
<img width="1889" alt="admin-dashboard" src="https://github.com/user-attachments/assets/3e7c48d8-e301-434c-85d4-3a11645d098e" />

### Home Page
<img width="1904" alt="homepage" src="https://github.com/user-attachments/assets/05503250-5a7b-4846-ad78-b4e34b100a7e" />

---

## 🔮 Future Improvements

* Mobile app version (React Native)
* Payment gateway integration
* Push notifications for orders
* Analytics dashboard for admin
* CI/CD pipeline with GitHub Actions

---

## 🤝 Contributing

* Fork repository
* Create feature branch
* Submit pull request

---

## 📄 License

MIT License


