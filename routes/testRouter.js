const express = require('express');
const testController = require('../controllers/test/testController');
const { protect } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(testController.getAllTests);
router
  .route('/user-test/:id')
  .delete(protect, testController.deteUserTest)
  .get(protect, testController.getUserTestById);
router
  .route('/user-test')
  .post(protect, testController.storeTest)
  .get(protect, testController.getUserTests);
router.route('/:id').get(testController.getTestById);
module.exports = router;
