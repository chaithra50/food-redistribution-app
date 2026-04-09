# FoodLink - Food Redistribution System

## Overview

FoodLink is a comprehensive full-stack web application designed to reduce food waste and support Zero Hunger (SDG 2). It connects three types of users:
- **Donors** (restaurants, individuals, hostels)
- **Receivers** (NGOs, orphanages)
- **Volunteers** (delivery helpers)

## Features

### 1. Authentication System
- User registration and login with role-based access
- Secure password handling with bcryptjs
- JWT-based authentication
- Three user roles: Donor, Receiver, Volunteer, Admin

### 2. Donor Features
- Add food donations with detailed information
  - Food name, quantity, food type (Veg/Non-Veg/Mixed)
  - Cooked time and expiry time
  - Location and optional image upload
- View donation history
- Track status (Available → Claimed → Picked Up → Delivered)
- Delete expired or invalid donations

### 3. Receiver Features
- View available food listings
- Filter by location, food type, and status
- Claim food donations
- View claimed food history
- Track delivery status

### 4. Volunteer Features
- View available delivery tasks
- Accept delivery requests
- Update delivery status (Picked Up/Delivered)
- Mark food as delivered

### 5. Admin Features
- View all users and manage verification status
- Monitor all food donations
- Remove invalid entries
- Dashboard analytics showing:
  - Total meals saved
  - Active users count
  - Total deliveries completed
  - User breakdown (Donors/Receivers/Volunteers)

### 6. UI/UX Features
- Clean, modern responsive design using Bootstrap
- Navigation bar and footer
- Food donation cards with important details
- Status tracking system
- Real-time status updates

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: Multer

### Frontend
- **Library**: React.js (v18)
- **Routing**: React Router v6
- **UI Framework**: Bootstrap 5 & React Bootstrap
- **HTTP Client**: Axios
- **Icons**: React Icons

### Database
- **MongoDB**: NoSQL database with collections for Users, Foods, and Deliveries

## Project Structure

```
food_redistribution_app/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── foodController.js
│   │   ├── deliveryController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Food.js
│   │   └── Delivery.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── food.js
│   │   ├── delivery.js
│   │   └── admin.js
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   ├── Footer.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── FoodCard.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── DonorDashboard.js
│   │   │   ├── ReceiverDashboard.js
│   │   │   ├── VolunteerDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── FoodDetail.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .gitignore
│
├── .gitignore
└── README.md
```

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (donor/receiver/volunteer/admin),
  address: String,
  city: String,
  state: String,
  pincode: String,
  organizationName: String (optional),
  verificationStatus: String (pending/verified/rejected),
  createdAt: Date,
  updatedAt: Date
}
```

### Food Collection
```javascript
{
  foodName: String,
  quantity: Number,
  unit: String (kg/liters/plates/portions),
  foodType: String (Veg/Non-Veg/Mixed),
  cookedTime: Date,
  expiryTime: Date,
  description: String,
  location: String,
  coordinates: { latitude, longitude },
  imageUrl: String,
  donor: ObjectId (ref: User),
  status: String (Available/Claimed/PickedUp/Delivered/Expired),
  claimedBy: ObjectId (ref: User),
  claimedAt: Date,
  assignedVolunteer: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Delivery Collection
```javascript
{
  food: ObjectId (ref: Food),
  donor: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  volunteer: ObjectId (ref: User),
  status: String (Pending/Accepted/PickedUp/Delivered/Cancelled),
  pickupLocation: String,
  deliveryLocation: String,
  pickupTime: Date,
  deliveryTime: Date,
  estimatedDeliveryTime: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Routes

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Food Routes
- `GET /api/food` - Get all food donations (with filters)
- `GET /api/food/:id` - Get food donation by ID
- `GET /api/food/donor-donations` - Get donor's donations (protected)
- `POST /api/food/add` - Add new food donation (protected, donor only)
- `POST /api/food/claim/:id` - Claim food donation (protected, receiver only)
- `PUT /api/food/status/:id` - Update food status (protected, donor only)
- `DELETE /api/food/:id` - Delete food donation (protected)

### Delivery Routes
- `GET /api/delivery` - Get all deliveries (protected)
- `GET /api/delivery/:id` - Get delivery by ID (protected)
- `GET /api/delivery/volunteer/tasks` - Get volunteer's tasks (protected, volunteer only)
- `POST /api/delivery/:id/accept` - Accept delivery task (protected, volunteer only)
- `PUT /api/delivery/:id/status` - Update delivery status (protected)

### Admin Routes
- `GET /api/admin/stats` - Get dashboard statistics (protected, admin only)
- `GET /api/admin/users` - Get all users (protected, admin only)
- `GET /api/admin/foods` - Get all food listings (protected, admin only)
- `DELETE /api/admin/foods/:id` - Delete food (protected, admin only)
- `PUT /api/admin/users/:id/verify` - Verify user (protected, admin only)
- `DELETE /api/admin/users/:id` - Delete user (protected, admin only)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas cloud)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file from example:**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your configuration:**
   ```env
   MONGO_URI=mongodb://localhost:27017/foodlink
   JWT_SECRET=your_secure_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

5. **Start MongoDB:**
   - If using local MongoDB:
     ```bash
     mongod
     ```
   - Or use MongoDB Atlas cloud connection string in MONGO_URI

6. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`

### Production Build

#### Backend Build
```bash
cd backend
npm install --production
# Then start with: npm start
```

#### Frontend Build
```bash
cd frontend
npm run build
npm start
```

## Usage Guide

### 1. User Registration
1. Go to the Register page
2. Fill in basic information (name, email, password)
3. Click Next
4. Select user role and provide location details
5. Complete registration

### 2. Donor Workflow
1. Login as a donor
2. Go to Donor Dashboard
3. Click "Add Donation"
4. Fill in food details, quantity, expiry time, and upload image
5. Click "Add Donation"
6. View donations in dashboard
7. Track status as it changes

### 3. Receiver Workflow
1. Login as a receiver
2. Go to Home page or Receiver Dashboard
3. Browse available food listings
4. Filter by location or food type
5. Click "Claim This Food" on desired donation
6. View claimed foods in dashboard
7. Wait for volunteer to confirm delivery

### 4. Volunteer Workflow
1. Login as a volunteer
2. Go to Volunteer Dashboard
3. View available delivery tasks
4. Accept tasks
5. Update status as you pick up and deliver
6. Mark as delivered

### 5. Admin Workflow
1. Login as admin (created manually in database)
2. Go to Admin Dashboard
3. View statistics and analytics
4. Manage users and their verification status
5. Monitor all food listings
6. Remove invalid entries

## Testing the Application

### Test User Accounts
Create test users through the registration process:

1. **Donor User**
   - Role: Donor
   - Add a food donation
   - Set future expiry time

2. **Receiver User**
   - Role: Receiver
   - Find and claim the donation

3. **Volunteer User**
   - Role: Volunteer
   - Accept delivery tasks
   - Update status

4. **Admin User** (created in database)
   - Create manually or use registration then update role in MongoDB

## Frontend Routes Structure

- `/` - Home page (public)
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/food/:id` - Food detail page (public)
- `/donor-dashboard` - Donor dashboard (protected)
- `/add-donation` - Add donation page (protected, redirects to donor-dashboard)
- `/receiver-dashboard` - Receiver dashboard (protected)
- `/volunteer-dashboard` - Volunteer dashboard (protected)
- `/admin-dashboard` - Admin dashboard (protected)

## Security Features

1. **Password Security**
   - Passwords hashed with bcryptjs (10 salt rounds)
   - Never stored in plaintext

2. **Authentication**
   - JWT-based token authentication
   - Token stored in localStorage
   - Token sent in Authorization header for protected routes

3. **Authorization**
   - Role-based access control
   - Protected routes check for valid token and role
   - Admin-only endpoints protected

4. **Input Validation**
   - Server-side validation using express-validator
   - Email format validation
   - Required field checks

## Error Handling

- Centralized error handling middleware
- Proper HTTP status codes
- User-friendly error messages
- Validation error responses

## Future Enhancements

1. **Email Notifications**
   - Send email when food is claimed
   - Send reminder before expiry
   - Delivery notification emails

2. **Google Maps Integration**
   - Display location on map
   - Route optimization for delivery

3. **Multi-language Support**
   - Add English + Kannada support
   - Localization framework

4. **Payment Integration**
   - Optional donation/tips system
   - Refund processing

5. **Mobile App**
   - React Native mobile application
   - Push notifications

6. **Real-time Updates**
   - WebSocket integration for live status updates
   - Real-time notifications

7. **Rating System**
   - Rate donors and receivers
   - Volunteer ratings

8. **Advanced Analytics**
   - Monthly reports
   - Impact visualizations
   - User engagement metrics

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Verify connection string format

### Port Already in Use
- Change PORT in .env (backend)
- Change port in package.json scripts (frontend)
- Or kill the process using the port

### CORS Error
- Check proxy setting in frontend package.json
- Ensure backend is running on correct port
- Backend CORS is configured for all origins by default

### Authentication Issues
- Clear localStorage and try logging in again
- Check JWT_SECRET in backend .env
- Verify token is sent in Authorization header

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact the development team

## Acknowledgments

This project is built to support SDG 2: Zero Hunger and reduce food waste in communities worldwide.

---

**FoodLink - Connecting Food to Those in Need**
