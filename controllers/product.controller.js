const Product = require('../models/product.model');
const db = require('../myDb');
const express = require("express");
let nodemailer = require("nodemailer");

exports.product_create = function (req, res) {
    let product = new Product(
        {
            name: req.body.name,
            startTime: new Date(parseInt(req.body.startTime)),
            endTime: new Date(parseInt(req.body.endTime))
        }
    );
    product.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("unable to save to database")
        });
};

exports.test1 =  function () {
    db.connect(async function (dbData) {
        await  (dbData.db("test").collection("products").find({ $and: [{ username: { $exists: false } }, { startTime: { $lt: new Date(parseInt(Date.now())) } }] }).toArray(async function  (err, result) {
            if (err) {
                //dbData.close();
                return res.status(400).send('Product not udpated.');
            }
           

             await result.forEach(element => async function(){
              await dbData.db("test").collection("bids").find({ productId: element._id }).sort({ amount: -1 }).limit(1).toArray(async function (err, result) {
                    if (err) {
                        console.log(err);
                    }

                    if (result.length === 1) {
                       await dbData.db("test").collection("products").update({ "_id": (result[0].productId) }, { $set: { "amount": result[0].amount, "username": result[0].username } }, function (err, result) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    };
                });
            })
        }));
        console.log("Product udpated.");
        await dbData.close();
    });
    
};


exports.test2 = function (req, res) {
    db.connect(async function (dbData) {
        console.log("HI, I'm in Test2")
        await dbData.db("test").collection("products").find({ username: { $exists: true } }, { email_sent: { $exists: false } }).toArray(async function (err, result) {
            if (err) {
                dbData.close();
                return res.status(400).send('Cannot send E-mail');
            }
            await result.forEach(element => async function(){
                await dbData.db("test").collection("bids").find({ productId: element._id }).toArray(async function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    await dbData.db("test").collection("users").find({ username: element.username }).toArray(async function (err, result) {
                        if (err) {
                            console.log(err);
                        }

                        // mail 
                        let transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: "pragyarustagi.2101@gmail.com",
                                pass: "oailzewcdnxeheoc"
                            }
                        });
                        await result.forEach(obj => {
                            let mailOptions = {
                                from: "pragyarustagi.2101@gmail.com",
                                to: obj.email,
                                subject: 'Bidding Result',
                                text: "Hi there, " + obj.name + " won the bid by " + element.amount + " for Product ID = " + element._id + " and Product = " + element.name

                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Email successfully sent!");
                                }
                            });
                        });
                    })
                })
            })
        })
        await dbData.close();
    })
};

exports.test3 = function (req, res) {
    db.connect(async function (dbData) {
        console.log("Hi, I'm in test3");
        await dbData.db("test").collection("products").find({ username: { $exists: true } }).toArray(async function (err, result) {
            if (err) {
                dbData.close();
               // return res.status(400).send('Cannot send E-mail');
            }
            await result.forEach(element => async function() {
                await dbData.db("test").collection("products").update({ "_id": element._id },{ $set: { "email_sent": "YES" } }), (function (err, result) {
                    if (err) {
                        console.log("akhil------");
                        console.log(result);
                        dbData.close();
                       // return res.status(400).send('Cannot send E-mail');
                    }
                })
            });
        });
        await dbData.close();
    });
}


    // exports.product_details = function (req, res) {
    //     Product.findById(req.params.id, function (err, product) {
    //         if (err) res.status(400).send("unable to read fucker");
    //         res.send(product);
    //     })
    // };

    exports.product_update = function (req, res) {

        Product.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, product) {
            if (err) res.status(400).send("unable to update fucker");
            res.send('Product udpated.');
        });
    };

    exports.all_products = function (req, res) {
        db.connect(function (dbdata) {
            dbdata.db("test").collection("products").find({}).toArray(function (err, result) {
                if (err) throw err;
                if (result.length > 0) {
                    dbdata.close();
                    res.status(200).send(result);
                }
                else {
                    dbdata.close();
                    res.status(400).send("No items to show");
                }
            });
        });
    };

