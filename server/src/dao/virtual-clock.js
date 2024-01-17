"use strict";

const { db } = require("../db");

exports.getDelta = () => {
  return db.prepare("select delta from VIRTUAL_CLOCK where id = 1").get();
};

exports.setDelta = (delta) => {
  return db
    .prepare("UPDATE VIRTUAL_CLOCK SET delta = ? WHERE id = 1")
    .run(delta);
};
