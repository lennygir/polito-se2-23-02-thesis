"use strict";

const Database = require("better-sqlite3");
const db = new Database("theses_management.db", { fileMustExist: true });

exports.db = db;
