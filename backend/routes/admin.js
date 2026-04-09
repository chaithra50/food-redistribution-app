const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  getAllFoods,
  removeFood,
  verifyUser,
  removeUser,
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require auth and admin role
router.use(auth, roleCheck('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/foods', getAllFoods);
router.delete('/foods/:id', removeFood);
router.put('/users/:id/verify', verifyUser);
router.delete('/users/:id', removeUser);

module.exports = router;
