const express = require('express');

const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { ADMIN } = require('../utils/constants');

router.route('/login').post(adminController.loginAdmin);
router.route('/').post(protect, restrictTo(ADMIN), adminController.createAdmin);

module.exports = router;
