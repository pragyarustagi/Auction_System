const Product = require('../models/product.model');
const db = require('../myDb');

exports.product_create = function (req, res) {
    let product = new Product(
        {
            name: req.body.name,
            startTime:  new Date(parseInt(req.body.startTime)),
            endTime : new Date(parseInt(req.body.endTime))
        }
    );
  product.save()
 .then(item => {
 res.send("item saved to database");
 })
 .catch(err => {
     console.log(err);
 res.status(400).send("unable to save to database")});
};

exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

// exports.product_details = function (req, res) {
//     Product.findById(req.params.id, function (err, product) {
//         if (err) res.status(400).send("unable to read fucker");
//         res.send(product);
//     })
// };

exports.product_update = function (req, res) {

    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
        if (err) res.status(400).send("unable to update fucker");
        res.send('Product udpated.');
    });
};

exports.all_products =  function(req, res) {
    db.connect(function(dbdata) {
        dbdata.db("test").collection("products").find({}).toArray(function(err, result) {
            if(err) throw err;
            if(result.length > 0) {
            dbdata.close();
            res.status(200).send(result);
            }
            else {
                dbdata.close();
                res.status(400).send("No y items to show");
            }
            });
        });
};

