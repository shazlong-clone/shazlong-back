const express = require('express');
const testController = require('../controllers/test/testController');

const router = express.Router();

router.route('/').get(testController.getAllTests);
router.route('/:id').get(testController.getTestById);
module.exports = router;
