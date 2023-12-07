"use strict";

const Database = require("better-sqlite3");
const db = new Database("theses_test.db");

exports.db = db;
