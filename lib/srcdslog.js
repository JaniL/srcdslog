/*
  srcdslog.js - Node.js module for realtime parsing of srcds logs

  (C) Copyright Jani Luukko 2011

  This library is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this library.  If not, see <http://www.gnu.org/licenses/>.
*/

var util = require('util');
var parseutils = require('./parseutils.js');

module.exports.parseLine = function(line,callback) {
  var startingpoint = line.indexOf('L ');

  if (startingpoint !== -1) {
    var line = line.substring(startingpoint);
  }

  parseutils.parseLineInfo(line, function(result) {
    // var type = result.type;
    // delete result.type;
    // console.log('Type of it: ' + type);
    // console.log(result);
    return callback(result);
  });

}
