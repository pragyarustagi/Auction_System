// app.js

const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

const product = require('./routes/product.route'); // Imports routes for the products
const user = require('./routes/user.route');
const bid = require('./routes/bid.route');
const cron = require('./routes/cron.route');
const app = express();

// Set up mongoose connection
const mongoose = require('mongoose');
const dbUrl   = `mongodb+srv://pragyarustagi:wewillcode@cluster0-cu8my.mongodb.net/AuctionSystem?retryWrites=true`;
mongoose.connect(dbUrl);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/products', product);
app.use('/user', user);
app.use('/bid', bid);
app.use('/cron', cron);
app.get('/cool', function (req, res) {
    res.send('0.0');
  })
app.use(cookieParser())

let port = process.env.PORT || 80

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});

