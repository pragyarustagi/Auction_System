const Product = require('../models/product.model');
const db = require('../myDb');
const express = require("express");
let nodemailer = require("nodemailer");
var asyncLoop = require('node-async-loop');

exports.product_create = function (req, res) {
    let product = new Product(
        {
            name: req.body.name,
            startTime: new Date(parseInt(req.body.startTime)),
            endTime: new Date(parseInt(req.body.endTime)),
            startingAmount: req.body.startingAmount
        }
    );
    product.save()
        .then(item => {
            res.send("Item saved to database");
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("Unable to save to Database")
        });
};





exports.test1 = async function () {
    await db.connect(async function (dbData) {
        console.log("log1");
        await myfunc(dbData);
        console.log("Product udpated.");
        await dbData.close();
    });
};


myfunc = async function (dbData){
    
    return new Promise (resolve =>{dbData.db("AuctionSystem").collection("products").find({ $and: [{ winner: { $exists: false } }, { startTime: { $lt: new Date(parseInt(Date.now())) } }] }).toArray(async function (err, result) {
        console.log("bkjsb");
      //  console.log(result);
        if (err) {
            console.log(err);
            //dbData.close();
            return res.status(400).send('Product not udpated.');
        }
        await myfunc2(result,dbData);

        
    })});
}

myfunc2 =async function (result,dbData) {
          asyncLoop(result,async function (element,next) {
                console.log(element);
                let var1 = await  cd(dbData,element);
                    await ab(var1,dbData);
                    next();
             }, function (err)
             {
                 if (err)
                 {
                     console.error('Error: ' + err.message);
                     return;
                 }
              
                 console.log('Finished!');
             });
}

cd = async function (dbData,element){
    console.log("cd");
   return  dbData.db("AuctionSystem").collection("bids").find({ productId: element._id }).sort({ amount: -1 }).limit(1).toArray();
}

ab =async  function (result,dbData) {        
        console.log("ab");
        if (result.length === 1) {
             dbData.db("AuctionSystem").collection("products").update({ "_id": (result[0].productId) }, { $set: { "amount": result[0].amount, "winner": result[0].username } }, function (err, result) {
                if (err) {
                    console.log(err);
                }
            });
        };
}

exports.test2 = async function (req, res) {
    await db.connect(async function (dbData) {
        console.log("HI, I'm in Test2")
        await dbData.db("AuctionSystem").collection("products").find({ winner: { $exists: true } }, { email_sent: { $exists: false } }).toArray(async function (err, result) {
            if (err) {
                dbData.close();
                return res.status(400).send('Cannot send E-mail');
            }
            await result.forEach(element => async function () {
                await dbData.db("AuctionSystem").collection("bids").find({ productId: element._id }).toArray(async function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    await dbData.db("AuctionSystem").collection("users").find({ username: element.username }).toArray(async function (err, result) {
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

exports.test3 = async function (req, res) {
    await db.connect(async function (dbData) {
        console.log("Hi, I'm in test3");
        await dbData.db("AuctionSystem").collection("products").find({ winner: { $exists: true } }).toArray(async function (err, result) {
            if (err) {
                dbData.close();
                
            }
            await result.forEach(element => async function () {
                await dbData.db("AuctionSystem").collection("products").update({ "_id": element._id }, { $set: { "email_sent": "YES" } }), (function (err, result) {
                    if (err) {
                        dbData.close();
                    }
                })
            });
        });
        await dbData.close();
    });
}


exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, product) {
        if (err) res.status(400).send("Unable to update Product Details");
        res.send('Product Details udpated.');
    });
};

exports.all_products = function (req, res) {
    db.connect(function (dbdata) {
        dbdata.db("AuctionSystem").collection("products").find({}).toArray(function (err, result) {
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

