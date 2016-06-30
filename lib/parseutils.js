'use strict';

var re2 = require('re2');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('srcdslog:parser');
var util = require('util');

class Parser {
  constructor() {
  }

  parseLineInfo(line) {
    if (Buffer.isBuffer(line) === true) {
      line = line.toString('utf8');
    }else {
      var startingpoint = line.indexOf('L ');
      if (startingpoint == -1) return;

      line = line.substring(startingpoint).replace(/(\r\n|\n|\r|\u0000)/gm, "").trim();
    }
    debug('Parsing', line);
    for (let message of Messages) {
      let regex = new re2(message.pattern);
      let matches = regex.match(line);
      if (matches) {
        debug('Found match', matches, line);
        let result = message.return.call(this, matches);
        this.emit('message', result);
        let type = result.type;
        delete result.type;
        debug('Emitting', type, result);
        this.emit(type, result);
        return {
          type: type,
          result: result,
        }
      }
    }
  }
}

util.inherits(Parser, EventEmitter);

module.exports = Parser;

module.exports.parseTime = function(line) {
  var result = line.match(/^L (\d\d)\/(\d\d)\/(\d\d\d\d) - (\d\d):(\d\d):(\d\d): /);
  if (!result || result.length == 0) return false;
  return new Date(
    parseInt(result[3],10),
    parseInt(result[1],10)-1,
    parseInt(result[2],10),
    parseInt(result[4],10),
    parseInt(result[5],10),
    parseInt(result[6],10),
    0
  );
};

module.exports.parsePlayer = function(line) {
  var result = line.match(/(.+)<(\d+)><(.+)><(.+)?>/);
  if (!result || result.length == 0) { return false; };
  return { name: result[1], id: parseInt(result[2],10), steamid: result[3], team: result[4] };
};

module.exports.parseArgs = function(args) {
  return args.match(/[(]([^"]|\\")+ ["]([^"]|\\")+["][)]/g);
};

var Messages = require('./Messages');
