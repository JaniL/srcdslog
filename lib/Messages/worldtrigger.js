var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: World triggered "([^"]+)" ?(.+)?$/,
  return: function (result) {
    console.log('world trigger result', result);
    var event = {
      type: 'worldtrigger',
      trigger: result[1],
      args: parser.parseArgs(result[2])
    };

    switch (event.trigger){
      case 'Round_Start':
        this.emit('roundStart');
        break;
      case 'Round_End':
        this.emit('roundEnd');
        break;
      default:break;
    }

    return event;
  }
};
