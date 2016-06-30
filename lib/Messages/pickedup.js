var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" picked up item ["](.+)["]$/,
  return: function (result) {
    return { type: 'picked up', player: parser.parsePlayer(result[1]), item: result[2] }
  }
};
