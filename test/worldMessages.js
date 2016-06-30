var assert = require('chai').assert;

var Parser = require('../lib/parseutils');
var parser = new Parser();

describe('worldMessages', function() {
  it('rcon', function () {
    assert.deepEqual(
      parser.parseLineInfo('L 06/30/2016 - 04:12:18: "TrueCarry<2><STEAM_1:1:27850535><CT>" say_team "hi"'),
      {
        type: 'say_team',
        result: {
          player: {
            name: 'TrueCarry',
            id: 2,
            steamid: 'STEAM_1:1:27850535',
            team: 'CT'
          },
          text: 'hi'
        }
      }
    );
  });
});