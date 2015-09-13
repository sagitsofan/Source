var Config = (function () {
    var fs = require('fs');

    var obj = JSON.parse(fs.readFileSync(global.appRoot + '\\config\\server.json', 'utf8').replace(/^\uFEFF/, ''));
    
    function _appSettings() {
        
        return obj;
    }

    return {
        appSettings: _appSettings
    };
})();

module.exports = Config;