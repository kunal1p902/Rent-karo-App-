# Rent-Karo 🚗 — Vehicle Rental Platform

A full-stack vehicle rental web application built with the **MEAN Stack** (MongoDB, Express.js, Angular, Node.js).

## 🏗️ Architecture

```
rent-karo/
├── backend/          → Express.js REST API + MongoDB
└── frontend/         → Angular 17+ SPA
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** running locally on port 27017 (or update `.env` with your Atlas URI)
- **Angular CLI** `npm install -g @angular/cli@17`

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure environment (edit `.env` if needed):
```
MONGO_URI=mongodb://localhost:27017/rent-karo
JWT_SECRET=rentkaro_super_secret_jwt_key_2024
PORT=3000
NODE_ENV=development
```

Start the backend:
```bash
npm run dev       # development (with nodemon)
# or
npm start         # production
```

Seed the database with sample data:
```bash
npm run seed
```

The API will be available at: **http://localhost:3000**  
Health check: **http://localhost:3000/api/health**

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start         # ng serve
```

The app will be available at: **http://localhost:4200**

---

## 👤 Default Test Accounts (after seeding)

### Customers
| Name | Email | Password |
|------|-------|----------|
| Rohan Verma | rohan@example.com | password123 |
| Anjali Gupta | anjali@example.com | password123 |
| Karan Malhotra | karan@example.com | password123 |

### Owners
| Name | Business | Email | Password |
|------|----------|-------|----------|
| Rajesh Kumar | Rajesh Rentals | rajesh@owner.com | password123 |
| Priya Sharma | Sharma Wheels | priya@owner.com | password123 |
| Amit Patel | Patel Motors | amit@owner.com | password123 |

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
```
POST /auth/register          → Register customer
POST /auth/login             → Login customer
POST /auth/owner/register    → Register owner
POST /auth/owner/login       → Login owner
GET  /auth/me                → Get current user (protected)
```

### Vehicles
```
GET    /vehicles             → List vehicles (supports filters)
GET    /vehicles/:id         → Vehicle details
POST   /vehicles             → Create vehicle (OWNER only)
PUT    /vehicles/:id         → Update vehicle (OWNER only)
DELETE /vehicles/:id         → Delete vehicle (OWNER only)
```

### Bookings
```
POST   /bookings             → Create booking (USER only)
GET    /bookings/my          → My bookings (USER)
GET    /bookings/owner       → Owner's bookings (OWNER)
GET    /bookings/:id         → Booking details
PUT    /bookings/:id/status  → Update status (OWNER/USER)
DELETE /bookings/:id         → Cancel booking (USER)
```

### User
```
GET /users/profile           → Get profile
PUT /users/profile           → Update profile
GET /users/wishlist          → Get wishlist
PUT /users/wishlist/:id      → Toggle wishlist item
```

### Owner
```
GET /owner/dashboard         → Dashboard stats
GET /owner/vehicles          → Owner's vehicles
GET /owner/bookings          → Owner's bookings
GET /owner/earnings          → Earnings breakdown
PUT /owner/profile           → Update profile
```

### Reviews
```
POST /reviews                → Create review (USER, completed booking required)
GET  /reviews/vehicle/:id    → Vehicle reviews
```

### Notifications
```
GET /notifications           → Get notifications
PUT /notifications/:id/read  → Mark as read
PUT /notifications/read-all  → Mark all as read
```

---

## 🎨 Features

### User Panel
- ✅ Browse & search vehicles with advanced filters
- ✅ Vehicle detail pages with image gallery
- ✅ Date-based availability checking
- ✅ Real-time price calculation
- ✅ Booking flow with mock payment
- ✅ My Bookings (upcoming/active/completed/cancelled tabs)
- ✅ Wishlist / favorites
- ✅ Invoice generation & print
- ✅ Vehicle reviews & ratings
- ✅ Vehicle comparison (up to 3)
- ✅ Profile management

### Owner Panel
- ✅ Dashboard with stats & revenue chart
- ✅ Add / edit / delete vehicles
- ✅ Upload multiple vehicle images
- ✅ Accept / reject / manage bookings
- ✅ Earnings with monthly breakdown
- ✅ Review management
- ✅ Notification center

### Technical
- ✅ JWT authentication with role-based access (USER / OWNER)
- ✅ bcrypt password hashing
- ✅ Protected route guards
- ✅ HTTP interceptor (auto-attach token)
- ✅ Race-condition-safe availability checking
- ✅ Responsive design (mobile / tablet / desktop)
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ 25+ seed vehicles with realistic Indian data

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17+ (Standalone components) |
| Styling | Vanilla CSS (Custom design system) |
| Backend | Express.js 4.x |
| Database | MongoDB 7 + Mongoose 8 |
| Runtime | Node.js 18+ |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| HTTP | Angular HttpClient |

---

## 📁 Project Structure

```
backend/src/
├── config/db.js
├── controllers/
│   ├── auth.controller.js
│   ├── booking.controller.js
│   ├── notification.controller.js
│   ├── owner.controller.js
│   ├── review.controller.js
│   ├── user.controller.js
│   └── vehicle.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── role.middleware.js
│   └── upload.middleware.js
├── models/
│   ├── Booking.js
│   ├── Notification.js
│   ├── Owner.js
│   ├── Review.js
│   ├── User.js
│   └── Vehicle.js
├── routes/
│   ├── auth.routes.js
│   ├── booking.routes.js
│   ├── notification.routes.js
│   ├── owner.routes.js
│   ├── review.routes.js
│   ├── user.routes.js
│   └── vehicle.routes.js
└── server.js

frontend/src/app/
├── auth/         → login, register, owner-login, owner-register
├── core/         → services, guards, interceptors, models
├── owner/        → dashboard, vehicles, bookings, earnings, reviews, profile
├── pages/        → home, vehicles, vehicle-detail, booking, payment, invoice, compare
├── shared/       → navbar, footer, vehicle-card, star-rating, toast, etc.
└── user/         → dashboard, bookings, wishlist, profile
```

---

## 🔐 Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens (7-day expiry)
- Protected API routes with middleware
- Role-based authorization (USER vs OWNER)
- Input validation on all endpoints
- Helmet.js security headers
- CORS configured

---

## 💰 Currency

All prices displayed in **Indian Rupees (₹)**

---

## 📱 Responsive

Fully responsive for:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)  
- 🖥️ Desktop (> 1024px)

---

## 🔮 Future Enhancements

- Real payment gateway (Razorpay / Stripe)
- WebSocket for real-time notifications
- Google Maps integration for vehicle location
- SMS notifications (Twilio)
- Email notifications (Nodemailer)
- Advanced analytics dashboard
- Driver/delivery service
- Multi-language support (Hindi, English)
"# Rent-karo-App-" 
"# Rent-karo-App-" 
"# rent-karo" 
"# rent-karo" 
