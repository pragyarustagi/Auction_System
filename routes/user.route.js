const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/user.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/create', user_controller.user_signup);
router.get('/signup', user_controller.user_login);
router.get('/logout', user_controller.user_logout);
module.exports = router;