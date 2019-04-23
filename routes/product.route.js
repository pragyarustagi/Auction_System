const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const product_controller = require('../controllers/product.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/create', product_controller.product_create);
router.get('/test1', product_controller.test1);
router.get('/test2', product_controller.test2);
router.get('/test3', product_controller.test3);
//router.get('/:id', product_controller.product_details);
router.put('/:id/update', product_controller.product_update);
router.get('/all_items', product_controller.all_products);

module.exports = router;