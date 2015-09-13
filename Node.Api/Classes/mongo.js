var config = require('./config.js');

var Mongo = (function () {
    var MongoClient = require('mongodb').MongoClient;

    function _connect(callback) {

        MongoClient.connect(config.appSettings().mongodb.host, function (err, db) {
            callback(db, err);
        });
    }
    
    return {
        connect: _connect
    };
})();

module.exports = Mongo;