const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BidSchema = new Schema({
    productId: {type: Schema.Types.ObjectId, required: true, max: 100},
    productName:{type: String, required: true, max: 100},
    username: {type: String, required: true, max: 100},
    amount: {type: Schema.Types.Number, required: true},
});


// Export the model
module.exports = mongoose.model('Bid', BidSchema);