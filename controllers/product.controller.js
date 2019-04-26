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
        await findproduct(dbData);
        await dbData.close();
    });
};


findproduct = async function (dbData) {
    return new Promise(resolve => {
        dbData.db("AuctionSystem").collection("products").find({ $and: [{ winner: { $exists: false } }, { startTime: { $lt: new Date(parseInt(Date.now())) } }] }).toArray(async function (err, result) {
            if (err) {
                console.log(err);
                return res.status(400).send('Product not udpated.');
            }
            await findbids(result, dbData);
        })
    });
}


findbids = async function (result, dbData) {
    asyncLoop(result, async function (element, next) {
        let var1 = await sortbids(dbData, element);
        await updateproduct(var1, dbData);
        next();
    }, function (err) {
        if (err) {
            console.error('Error: ' + err.message);
            return;
        }
    });
}

sortbids = async function (dbData, element) {
    return dbData.db("AuctionSystem").collection("bids").find({ productId: element._id }).sort({ amount: -1 }).limit(1).toArray();
}

updateproduct = async function (result, dbData) {
    if (result.length === 1) {
        dbData.db("AuctionSystem").collection("products").update({ "_id": (result[0].productId) }, { $set: { "amount": result[0].amount, "winner": result[0].username } }, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
    };
}


exports.test2 = async function () {
    await db.connect(async function (dbData) {
        await checkemail(dbData);
        await dbData.close();
    });
};

checkemail = async function (dbData) {
    return new Promise(resolve => {
        dbData.db("AuctionSystem").collection("products").find({ $and: [{ winner: { $exists: true } }, { email_sent: { $exists: false } }] }).toArray(async function (err, result) {
            if (err) {
                console.log(err);
                return res.status(400).send('Cannot send E-mail.');
            }
            let count = 0
            result.forEach(element => {
                count = count + 1;
            })
            if (count >= 1)
                await searchbids(result, dbData);
        })
    });
}

searchbids = async function (result, dbData) {
    console.log("result is", result)
    asyncLoop(result, async function (element, next) {
        let var1 = await getusername(dbData, element);
        console.log("var1", var1);
        console.log("element",element);
        await getusers(dbData, var1, element);
        next();
    }, function (err) {
        if (err) {
            console.error('Error: ' + err.message);
            return;
        }
    });
}

getusername = async function (dbData, element) {
    return dbData.db("AuctionSystem").collection("bids").distinct("username", { productId: element._id });
}

getusers = async function (dbData, obj1, element) {
    asyncLoop(obj1, async function (ele, next) {
        let var2 = await getuserarray(dbData, ele);
        console.log(var2);
        await sendmail(var2, element, dbData)
        next();

    }, function (err) {
        if (err) {
            console.error('Error: ' + err.message);
            return;
        }
    });
}

getuserarray = async function (dbData, element) {
    console.log("Hiiiii", element.username)
    return dbData.db("AuctionSystem").collection("users").find({ username: element }).toArray();
}

sendmail = async function (var2, element, dbData) {
    console.log("sent email", element)
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "pragyarustagi.2101@gmail.com",
            pass: ""
        }
    })
    let mailOptions = {
        from: "pragyarustagi.2101@gmail.com",
        to: var2[0].email,
        subject: 'Bidding Result',
        text: "Hi there, " + element.winner + " won the bid by " + element.amount + " for Product ID = " + element._id + " and Product = " + element.name
    }
    return transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email successfully sent!");
        }
        dbData.close();
    })
}

exports.test3 = async function () {
    await db.connect(async function (dbData) {
        await findproducts(dbData);
        await dbData.close();
    });
};

findproducts = async function (dbData) {
    return new Promise(resolve => {
        dbData.db("AuctionSystem").collection("products").find({ winner: { $exists: true } }).toArray(async function (err, result) {
            if (err) {
                console.log(err);
            }
            let count = 0
            result.forEach(element => {
                count = count + 1
            })
            if (count >= 1) 
                await updateproductemail(result, dbData);
        })
    });
}

updateproductemail = async function (result, dbData) {
    asyncLoop(result, async function (element, next) {
        await updateemail(dbData, element);
        next();
    }, function (err) {
        if (err) {
            console.error('Error: ' + err.message);
            return;
        }
    });
}

updateemail = async function (dbData, element) {
    return dbData.db("AuctionSystem").collection("products").update({ "_id": element._id }, { $set: { "email_sent": "YES" } });
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

