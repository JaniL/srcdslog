var parser = require('../parseutils');

module.exports = {
  pattern: /^L (\d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d): "(.+)" \[(-?\d+) (-?\d+) (-?\d+)\] killed "(.+)" \[(-?\d+) (-?\d+) (-?\d+)\] with "(.+)" ?(\(headshot\))?(\(headshot\))?$/,
  return: function (result) {
    var event = {
      time: parser.parseTime(result[0]),
      type: 'kill',
      player: parser.parsePlayer(result[2]),
      killed: parser.parsePlayer(result[6]),
      weapon: result[10],
      headshot: !!result[11]
    };

    let eventDeath = new Object(event);
    delete event.type;
    this.emit('death', eventDeath);

    return event;
  }
};
