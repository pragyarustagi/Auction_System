const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const cron = require('../controllers/cron.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/start', cron.cron_start);
router.get('/stop', cron.cron_stop);
module.exports = router;