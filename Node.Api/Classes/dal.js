var adapter = require('./mongo.js');
var ObjectID = require('mongodb').ObjectID;

var Dal = (function () {

    function _getData(schema, callback) {
        
        adapter.connect(function (db, err) {
            
            var arr = [];
            var collection = db.collection(schema);
            var items = collection.find();
            
            items.each(function (err, item) {
                if (item != null) {
                    arr.push(item);
                     
                } else {
                    callback(arr)
                }
            });
        });
    }
    

    return {
        getData: _getData
    };
})();

module.exports = Dal;