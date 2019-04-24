const Bid = require('../models/bid.model');
const db = require('../myDb');
const Product = require('../models/product.model');

exports.bid_create = function (req, res) {
    var cookie = req.header('Cookie');
    db.connect(function (dbData) {
        Product.findById(req.body.productId, function (err, result) {
            if (err) res.status(400).send("invalid product");
            if (Date.now() <= result.endTime) {
                dbData.db("AuctionSystem").collection("cookieuserdatas").find({ cookie: cookie }).toArray(function (err, result) {
                    let count = 0;
                    result.forEach(element => {
                        count = count + 1;
                    });
                    if (count === 1) {
                        let bid = new Bid(
                            {
                                productId: req.body.productId,
                                productName: req.body.productName,
                                username: result[0].username,
                                amount: req.body.amount
                            });
                        Product.findById(req.body.productId, function (err, result) {
                            if (req.body.amount > result.startingAmount) {
                                bid.save()
                                    .then(item => {
                                        res.send("Bidding done successfully!");
                                    });
                            }
                            else {
                                res.status(400).send("Bidding Amount is less");
                            }
                        })

                    }
                    else {
                        res.status(400).send("User Not Logged in");
                    }
                });

            }
            else {
                res.status(400).send("Bid expired");
            }
        });
    });
}

exports.get_bid = function (req, res) {
    var cookie = req.header('Cookie');
    db.connect(function (dbData) {
        dbData.db("AuctionSystem").collection("cookieuserdatas").find({ cookie: cookie }).toArray(function (err, result) {
            let count = 0;
            result.forEach(element => {
                count = count + 1;
            });
            if (count === 1) {
                dbData.db("AuctionSystem").collection("bids").find({ username: result[0].username }).toArray(function (err, result) {
                    res.status(200).send(result);
                })
            }
            else {
                res.status(400).send("Not Logged in");
            }
        });
    })
}
