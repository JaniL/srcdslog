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

exports.Parser = Parser;

var dgram = require("dgram");
var util = require('util');
var parseutils = require('./parseutils.js');

function Parser(port, opt) {
  var self = this;
  self.opt = {
    port: port,
    debug: false,
  };

var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
  console.log("server got: " + msg.toString('utf8',11) + " from " +
    rinfo.address + ":" + rinfo.port);
/*
  console.log(parseutils.parseTime(msg.toString('utf8',5)));
  console.log(parseutils.parsePlayer(msg.toString('utf8',5)));
  console.log(parseutils.parseLineInfo(msg.toString('utf8',5)));
*/
  self.emit('raw', msg);

  parseutils.parseLineInfo(msg.toString('utf8',11), function(result) {
    var type = result.type;
    delete result.type;
    console.log('Type of it: ' + type);
    console.log(result);
    self.emit(type, result);
  });

});

server.bind(port);

process.EventEmitter.call(this);
}

util.inherits(Parser, process.EventEmitter);
