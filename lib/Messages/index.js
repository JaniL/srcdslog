'use strict';
var fs = require('fs');

module.exports = fs.readdirSync(__dirname)
  .filter((name) => name.indexOf('index.js') == -1)
  .map((name) => require('./' + name));
