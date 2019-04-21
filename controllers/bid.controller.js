const Bid = require('../models/bid.model');
const db = require('../myDb');

exports.bid_create = function (req, res) {
    var cookie = req.header('Cookie');
    // console.log(cookie);
    // console.log(cookie === "Z5kdkpKg3SwNj8WE; login=Z5kdkpKg3SwNj8WE");

    db.connect(function(dbData){
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
        })
    });
 }