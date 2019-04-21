const User = require('../models/user.model');
const CookieUserData = require('../models/cookieuserdata.model');
const db = require('../myDb');
var randomstring = require("randomstring");


exports.user_signup = function (req, res) {
    let user = new User(
        {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,ç
        }
    );
  user.save()
 .then(item => {
 res.send("User saved to database");
 })
 .catch(err => {
 res.status(400).send("Unable to save to database")});
};

exports.user_login =  function (req, res) {
    console.log(req.query.username);
   db.connect(function(dbdata) {
    dbdata.db("test").collection("users").find({username: req.query.username, password: req.query.password }).toArray(function(err, result) {
        if (err) throw err;
        let count =0;
       
        result.forEach(element => {
            count= count+1;
        });        
        if(count === 1)
        {
            let randString = randomstring.generate(16);
            res.cookie('login', randString );
            let cookieUserData = new    CookieUserData({
                cookie : randString,
                username : result[0].username
            });
            cookieUserData.save();
            dbdata.close();
            res.status(200).send("Logged in");         
        }
        else
        {
            dbdata.close();
            res.status(400).send("wrong user id or  password");
        }
      });

});
}

exports.user_logout =  function(req, res) {
    db.connect(function(dbdata) {
        dbdata.db("test").collection("cookieuserdatas").find({cookie: req.query.cookie}).toArray(function(err, result) {
            if(err) throw err;
            let count =0;

            result.forEach(element => {
                count= count+1;
            });
            console.log(count);
            if(count == 1)
            {
                let cookie1 = result[0].cookie
                dbdata.db("test").collection("cookieuserdatas").deleteOne({cookie: cookie1})
                res.status(200).send("Logout successful");
            }
            else
            {
                dbdata.close();
                res.status(400).send("Cookie doesn't exist");
            }
        });
    });
}



