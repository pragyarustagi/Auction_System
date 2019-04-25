var cron = require('node-cron');
const db = require('../myDb');
const Product = require('../models/product.model');
const test = require('./product.controller');

var task = cron.schedule('*/1 * * * *',async () => {
    console.log('will execute every minute until stopped');
    // var resultA = await (test.test1());
    // var resultB = await (test.test2());
    // var resultC = await (test.test3());

    test.test1().then(test.test2()).then(test.test3());
    
});


exports.cron_stop = function (req, res) {
    task.stop();
    res.status(200).send("cron stop successful");
}
exports.cron_start = function (req, res) {
    task.start();
    res.status(200).send("cron start successful");
}