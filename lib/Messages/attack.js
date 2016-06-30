var parser = require('../parseutils');

module.exports = {
  pattern: /^L (\d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d): "(.+)" \[(-?\d+) (-?\d+) (-?\d+)\] attacked "(.+)" \[(-?\d+) (-?\d+) (-?\d+)\] with "(.+)" \(damage "(\d+)"\) \(damage_armor "(\d+)"\) \(health "(\d+)"\) \(armor "(\d+)"\) \(hitgroup "(.+)"\)$/,
  return: function (result) {
    return {
      time: parser.parseTime(result[0]),
      type: 'attack',
      player: parser.parsePlayer(result[2]),
      killed: parser.parsePlayer(result[6]),
      weapon: result[10],
      damage: parseInt(result[11]),
      damage_armor: parseInt(result[12]),
      health: parseInt(result[13]),
      armor: parseInt(result[14]),
      hitgroup: result[15],
      headshot: result[15] == 'head',
    }
  }
};
