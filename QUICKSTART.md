# FoodLink - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js installed
- MongoDB running (local or cloud)
- Two terminal windows

### Step 1: Clone & Navigate
```bash
cd backend
```

### Step 2: Setup Backend (Terminal 1)

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
copy .env.example .env
```

3. Edit `.env`:
```env
MONGO_URI=mongodb://localhost:27017/foodlink
JWT_SECRET=your_secret_key_123
PORT=5000
NODE_ENV=development
```

4. Start MongoDB (if local):
```bash
mongod
```

5. Start backend:
```bash
npm run dev
```

You should see: `FoodLink Backend running on port 5000`

### Step 3: Setup Frontend (Terminal 2)

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend:
```bash
npm start
```

Frontend opens automatically at `http://localhost:3000`

## 📝 Test Scenarios

### Scenario 1: Donor Flow
1. Register as **Donor**
   - Email: donor@example.com
   - Password: password123
   - Organization: Your Restaurant

2. Add Donation
   - Food: "Biryani"
   - Quantity: 10 plates
   - Type: Non-Veg
   - Expiry: Set 2 hours from now
   - Location: Your restaurant address

3. View in dashboard

### Scenario 2: Receiver Flow
1. Register as **Receiver**
   - Email: receiver@example.com
   - Password: password123
   - Organization: Food Bank

2. Go Home page
3. Find the biryani donation
4. Click "Claim This Food"
5. Check receiver dashboard

### Scenario 3: Volunteer Flow
1. Register as **Volunteer**
   - Email: volunteer@example.com
   - Password: password123

2. Go to Volunteer Dashboard
3. Accept available delivery
4. Update status to "Picked Up"
5. Update status to "Delivered"

## 🛠️ Useful Commands

### Backend
```bash
npm run dev       # Development mode with nodemon
npm start         # Production mode
npm install       # Install dependencies
```

### Frontend
```bash
npm start         # Start development server
npm run build     # Build for production
npm test          # Run tests
```

## 🔧 MongoDB Setup

### Local MongoDB
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and cluster
3. Get connection string
4. Update MONGO_URI in .env:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/foodlink
```

## 📱 API Testing

Use Postman or similar tool:

### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Donor",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "donor",
  "address": "123 Main St",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "organizationName": "My Restaurant"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes token - use in Authorization header:
```
Authorization: Bearer <your_token>
```

### Get All Foods
```
GET http://localhost:5000/api/food
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check MONGO_URI, ensure MongoDB is running |
| Port 5000 in use | Change PORT in .env or kill process |
| Port 3000 in use | Kill process or change package.json |
| Hot reload not working | Restart dev server |
| Blank page on localhost:3000 | Check browser console for errors |

## 📂 File Structure Quick Reference

```
Backend File Changes
├── models/        ← Database schemas
├── routes/        ← API endpoints
├── controllers/   ← Business logic
├── middleware/    ← Auth, error handling
└── server.js      ← Main server file

Frontend File Changes
├── pages/         ← Main pages
├── components/    ← Reusable components
├── utils/         ← API calls, auth helpers
└── App.js         ← Routing setup
```

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Can register user
- [ ] Can login
- [ ] Can see home page with listings
- [ ] Dashboard loads for your role

## 🎯 Common Tasks

### Add Sample Data (in MongoDB)
```javascript
// Create admin user
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "<hashed_password>",
  role: "admin",
  // ... other fields
})
```

### Reset Database
```bash
# MongoDB command
mongo
use foodlink
db.users.deleteMany({})
db.foods.deleteMany({})
db.deliveries.deleteMany({})
```

### View Logs
- Backend: Check terminal where npm run dev is running
- Frontend: Open browser console (F12)

## 📞 Need Help?

1. Check README.md for detailed documentation
2. Review .env.example for configuration options
3. Check backend server.js for route structure
4. Check frontend App.js for page structure

## 🎉 You're All Set!

Your FoodLink application is ready to use. Start with:
1. Register a donor
2. Add a food donation
3. Register a receiver
4. Claim the food
5. Register a volunteer
6. Complete delivery

Enjoy! 🍽️
