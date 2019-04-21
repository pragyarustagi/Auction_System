const mongoose = require('mongoose');
const Schema = mongoose.Schema;



let ProductSchema = new Schema({
    name: {type: String, required: true, max: 10},
    description: {type: String  , required: false, max: 50},
    startTime:{type: Date , required : true },
    endTime:{type: Date , required : true},
    winner: {type: String, required: false, max: 100},
    imageURL: {type : Schema.Types.Mixed , required : false }
});


// Export the model
module.exports = mongoose.model('Product', ProductSchema);