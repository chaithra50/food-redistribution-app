const express = require('express');
const multer = require('multer');
const { auth, roleCheck } = require('../middleware/auth');
const {
  addDonation,
  getDonations,
  getDonationById,
  getDonorDonations,
  claimFood,
  updateFoodStatus,
  deleteDonation,
} = require('../controllers/foodController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'backend/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Donor routes
router.post('/add', auth, roleCheck('donor'), upload.single('image'), addDonation);
router.get('/donor-donations', auth, roleCheck('donor'), getDonorDonations);
router.put('/status/:id', auth, roleCheck('donor'), updateFoodStatus);
router.delete('/:id', auth, deleteDonation);

// Public routes
router.get('/', getDonations);
router.get('/:id', getDonationById);

// Receiver routes
router.post('/claim/:id', auth, roleCheck('receiver'), claimFood);

module.exports = router;
