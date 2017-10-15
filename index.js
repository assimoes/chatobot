var db = require('./src/store/memstore');

global.db = db.db;

var _app = require('./src/server');
_app();