'use strict';

const sqlite = require('sqlite3');

exports.db = new sqlite.Database('theses_management.db', (err) => {
    if (err) throw err;
});