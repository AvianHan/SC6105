// backend/routes/review.js

const express = require('express');
const router = express.Router();
const paperController = require('../controllers/reviewController');

// 已有的一些router.xxxx()

router.post('/inviteReviewer', reviewController.inviteReviewer);
router.post('/submitReview', reviewController.submitReview);

module.exports = router;
