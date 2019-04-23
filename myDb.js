let dbconnection = null;

 const mongo = require('mongodb').MongoClient
 const dbUrl   = `mongodb+srv://pragyarustagi:wewillcode@cluster0-cu8my.mongodb.net/AuctionSystem?retryWrites=true`;

    
module.exports.connect = function connect(fun) {
    mongo.connect(dbUrl,function(err,db){
        if(err) throw err ;
        fun(db);
    });
}



