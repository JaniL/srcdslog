var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: Started map "(.+)" (CRC "(.+)")$/,
  return: function (result) {
    return { type: 'startedMap', map: result[1], crc: result[2] }
  }
};
