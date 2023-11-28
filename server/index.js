"use strict";

// Read environment variables
const dotenv = require('dotenv');
dotenv.config();

const app = require("./src/server.js");
const port = 3000;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});