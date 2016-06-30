var assert = require('chai').assert;

var Parser = require('../lib/parseutils');
var parser = new Parser();

describe('Messages', function() {
  it('say_team', function () {
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
  it('say', function () {
    assert.deepEqual(
      parser.parseLineInfo('L 06/30/2016 - 04:12:23: "TrueCarry<2><STEAM_1:1:27850535><CT>" say "hi"'),
      {
        type: 'say',
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

  it('kill', function () {
    assert.deepEqual(
      parser.parseLineInfo('L 06/30/2016 - 04:12:06: "Ethan<4><BOT><TERRORIST>" [864 940 3] killed "Alfred<5><BOT><CT>" [1276 1150 65] with "deagle"'),
      {
        type: 'kill',
        result: {
          player: {
            name: 'Ethan',
            id: 4,
            steamid: 'BOT',
            team: 'TERRORIST',
          },
          killed: {
            name: 'Alfred',
            id: 5,
            steamid: 'BOT',
            team: 'CT'
          },
          time: new Date('2016-06-30T01:12:06.000Z'),
          weapon: 'deagle',
          headshot: false,
        }
      }
    );
  });
  it('kill_hs', function () {
    assert.deepEqual(
      parser.parseLineInfo('L 06/30/2016 - 04:12:06: "Ethan<4><BOT><TERRORIST>" [864 940 3] killed "Alfred<5><BOT><CT>" [1276 1150 65] with "deagle" (headshot)'),
      {
        type: 'kill',
        result: {
          player: {
            name: 'Ethan',
            id: 4,
            steamid: 'BOT',
            team: 'TERRORIST',
          },
          killed: {
            name: 'Alfred',
            id: 5,
            steamid: 'BOT',
            team: 'CT'
          },
          time: new Date('2016-06-30T01:12:06.000Z'),
          weapon: 'deagle',
          headshot: true,
        }
      }
    );
  });
  it('attack', function () {
    assert.deepEqual(
      parser.parseLineInfo('L 06/30/2016 - 04:12:06: "Tim<11><BOT><TERRORIST>" [623 710 2] attacked "Alfred<5><BOT><CT>" [1276 1150 1] with "p90" (damage "56") (damage_armor "12") (health "28") (armor "86") (hitgroup "head")'),
      {
        type: 'attack',
        result: {
          player: {
            name: 'Tim',
            id: 11,
            steamid: 'BOT',
            team: 'TERRORIST',
          },
          killed: {
            name: 'Alfred',
            id: 5,
            steamid: 'BOT',
            team: 'CT'
          },
          time: new Date(2016, 5, 30, 4, 12, 6, 0),
          weapon: 'p90',
          damage: 56,
          damage_armor: 12,
          health: 28,
          armor: 86,
          hitgroup: 'head',
          headshot: true,
        }
      }
    );
  });
  it('assist', function () {
    assert.deepEqual(
      parser.parseLineInfo('L 06/30/2016 - 04:12:06: "Tim<11><BOT><TERRORIST>" assisted killing "Alfred<5><BOT><CT>"'),
      {
        type: 'assist',
        result: {
          player: {
            name: 'Tim',
            id: 11,
            steamid: 'BOT',
            team: 'TERRORIST',
          },
          killed: {
            name: 'Alfred',
            id: 5,
            steamid: 'BOT',
            team: 'CT'
          },
          time: new Date(2016, 5, 30, 4, 12, 6, 0),
        }
      }
    );
  });
});