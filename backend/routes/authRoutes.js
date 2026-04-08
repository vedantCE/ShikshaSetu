const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
	register,
	login,
	getProfileSchema,
	getProfile,
	updateParentProfile,
	changePassword,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile-schema', auth, getProfileSchema);
router.get('/profile', auth, getProfile);
router.patch('/parent/update-profile', auth, updateParentProfile);
router.post('/change-password', auth, changePassword);

module.exports = router;
