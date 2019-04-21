const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CookieSchema = new Schema({
    cookie: {type: String, required: true, max: 16},
    username: {type: String, required: true, max: 100}
});


// Export the model
module.exports = mongoose.model('CookieUserData', CookieSchema);