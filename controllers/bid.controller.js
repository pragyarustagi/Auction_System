const Bid = require('../models/bid.model');
const db = require('../myDb');
const Product = require('../models/product.model');

exports.bid_create = function (req, res) {
    var cookie = req.header('Cookie');
     console.log(req.body.productId);
    // console.log(cookie === "Z5kdkpKg3SwNj8WE; login=Z5kdkpKg3SwNj8WE");
    db.connect(function(dbData){
        Product.findById(req.body.productId,function(err,result){
            if(err) res.status(400).send("invalid product");

            console.log(result);
                if(Date.now() <= result.endTime)
                {
                    dbData.db("test").collection("cookieuserdatas").find({cookie : cookie}).toArray(function(err,result){
                        let count =0;
                        result.forEach(element => {
                            count=count+1;
                        });
                        console.log(count);
                        if(count === 1)
                        {
                            let bid = new Bid (
                                {
                                    productId: req.body.productId,
                                    productName:  req.body.productName,
                                    username : result[0].username,
                                    amount : req.body.amount
                                });
                                bid.save()
                                .then(item => {
                                res.send("bid saved to database");
                                });
                        }
                        else{
                            res.status(400).send("Not Logged in");
                        }
                    });

                }
                else
                {
                    res.status(400).send("Bid expired");
                }
        });
    });
 }

exports.get_bid = function (req,res){
    var cookie = req.header('Cookie');
    db.connect(function(dbData){
        dbData.db("test").collection("cookieuserdatas").find({cookie : cookie}).toArray(function(err,result){
            let count =0;
            result.forEach(element => {
                count=count+1;
            });
            console.log(count);
            console.log(result);
            if(count === 1)
            {
                console.log(result[0].username);

                dbData.db("test").collection("bids").find({username :  result[0].username}).toArray(function(err,result){
                    res.status(200).send(result);
                })
            }
            else{
                res.status(400).send("Not Logged in");
            }
        });
    })
}
 