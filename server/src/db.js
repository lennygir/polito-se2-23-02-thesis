'use strict';

const sqlite = require('sqlite3');

exports.db = new sqlite.Database('cmsmall.db', (err) => {
    if (err) throw err;
});