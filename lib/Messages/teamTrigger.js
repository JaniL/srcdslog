var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: Team "(.+)" triggered "([^"]+)" ?(.+)?$/,
  return: function (result) {
    var event = {
      type: 'teamTrigger',
      team: result[1],
      trigger: result[2],
      args: parser.parseArgs(result[3])
    };
    this.emit('roundWin', {
      team: event.team,
      reason: event.trigger,
    });
    return event;
  }
};
