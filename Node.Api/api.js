var dal = require('./classes/dal.js');

var Api = (function () {
    
    function _initialize(app) {
        
        //cross domain management
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        
        app.get('/api/:schema', function (req, res) {
            
            dal.getData(req.params.schema, function (results) {
                res.json(results);
            });
        });
    }
    
    return {
        initialize: _initialize
    };
})();

module.exports = Api;