const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const bid = require('../controllers/bid.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/create', bid.bid_create);
module.exports = router;