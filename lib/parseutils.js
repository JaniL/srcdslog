var async = require('async');

module.exports.parseTime = function(line) {
  var result = line.match(/^L (\d\d)\/(\d\d)\/(\d\d\d\d) - (\d\d):(\d\d):(\d\d): /);
  if (!result || result.length == 0) return false;
  return new Date(parseInt(result[3],10), parseInt(result[1],10)-1, parseInt(result[2],10), parseInt(result[4],10), parseInt(result[5],10), parseInt(result[6],10), 0);
};

module.exports.parsePlayer = function(line) {
  var result = line.match(/(.+)<(\d+)><(.+)><?(.+)>/);
  if (!result || result.length == 0) { return false; };
  return { name: result[1], id: parseInt(result[2],10), steamid: result[3], team: result[4] };
};

function parseArgs(args) {
  var result = args.match(/[(]([^"]|\\")+ ["]([^"]|\\")+["][)]/g);
  return result;
}

module.exports.parseLineInfo = function(line,callback) {
  /*
  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: Team ["](.+)["] triggered ["](.+)["] (.+)$/);
  if (result !== null) {
    var lit = { type: 'teamtrigger', trigger: result[2], team: result[1], args: parseArgs(result[3]) };
    // lit[args][result[2]] = result[3];
    return lit;
  }
  */
  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: World triggered ["](.+)["] (.+)$/);
  if (result !== null) {
    return callback({ type: 'worldtrigger', trigger: result[1], args: parseArgs(result[2]) });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: World triggered ["](.+)["]$/);
  if (result !== null) {
    return callback({ type: 'worldtrigger', trigger: result[1] });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: rcon from ["](.+)[:](\d+)["][:] command ["](.+)["]$/);
  if (result !== null) {
    return callback({ type: 'rcon', address: result[1], port: parseInt(result[2],10), command: result[3] });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" picked up item ["](.+)["]$/);
  if (result !== null) {
    return callback({ type: 'picked up', player: module.exports.parsePlayer(result[1]), item: result[2] });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: ["](.+)["] committed suicide with ["](.+)["] [(]attacker_position ["](.+) (.+) (.+)["][)]$/);
  if (result !== null) {
    return callback({ type: 'suicide', player: module.exports.parsePlayer(result[1]), with: result[2], attacker_position: [parseInt(result[3]), parseInt(result[4]), parseInt(result[5])] });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" changed role to ["](.+)["]$/);
  if (result !== null) {
    return callback({ type: 'changed role', player: module.exports.parsePlayer(result[1]) , role: result[2] });  
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" connected, address ["](.+):(.+)["]$/);
  if (result !== null) {
    return callback({ type: 'connected', player: module.exports.parsePlayer(result[1]), ip: result[2], port: parseInt(result[3]) });  
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" STEAM USERID validated$/);
  if (result !== null) {
    return callback({ type: 'STEAM USERID validated', player: module.exports.parsePlayer(result[1]) });  
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" disconnected (reason "(.+)")$/);
  if (result !== null) {
    return callback({ type: 'disconnected', player: module.exports.parsePlayer(result[1]), reason: result[2] });  
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" joined team ["](.+)["]$/);
  if (result !== null) {
    return callback({ type: 'joined team', player: module.exports.parsePlayer(result[1]), team: result[2] });  
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" entered the game$/);
  if (result !== null) {
    return callback({ type: 'entered the game', player: module.exports.parsePlayer(result[1]) });  
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: Started map "(.+)" (CRC "(.+)")$/);
  if (result !== null) {
    return callback({ type: 'startedMap', map: result[1], crc: result[2] });  
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: Team "(.+)" current score "(\d+)" with "(\d+)" players$/);
  if (result !== null) {
    return callback({ type: 'currentScore', team: result[1], score: parseInt(result[2]), players: parseInt(result[3]) })
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: Team "(.+)" final score "(\d+)" with "(\d+)" players$/);
  if (result !== null) {
    return callback({ type: 'finalScore', team: result[1], score: parseInt(result[2]), players: parseInt(result[3]) })
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" spawned as ["](.+)["]$/);
  if (result !== null) {
   return callback({ type: 'spawned', player: module.exports.parsePlayer(result[1]), role: result[2] });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" say ["](.+)["]$/);
  if (result !== null) {
    return callback({ type: 'say', player: module.exports.parsePlayer(result[1]), text: result[2] });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" say_team ["](.+)["]$/);
  if (result !== null) {
    return callback({ type: 'say_team', player: module.exports.parsePlayer(result[1]), text: result[2] });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" position_report (.+)$/);
  if (result !== null) {
    return callback({ type: 'position_report', player: module.exports.parsePlayer(result[1]), text: parseArgs(result[2]) });
  }

  //Example:  'L 09/16/2012 - 20:19:02: "Grant<9><BOT><CT>" killed "Alfred<6><BOT><TERRORIST>" with "hkp2000" (headshot)'
  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" killed "(.+)" with ["](.+)["] (\(headshot\))\n\u0000$/);
   if (result !== null) {
    return callback({ type: 'kill', player: module.exports.parsePlayer(result[1]), killed: module.exports.parsePlayer(result[2]), weapon: result[3], headshot:  true});
  }
  
  //Example: 'L 09/16/2012 - 20:19:02: "Grant<9><BOT><CT>" killed "Alfred<6><BOT><TERRORIST>" with "hkp2000"'
  var result = line.match(/^L (\d\d\/\d\d\/\d\d\d\d) - (\d\d:\d\d:\d\d:) "(.+)" killed "(.+)" with ["](.+)["]\n\u0000$/);
   if (result !== null) {
    return callback({ time: result[2], type: 'kill', player: module.exports.parsePlayer(result[3]), killed: module.exports.parsePlayer(result[4]), weapon: result[5], headshot: false });
  }
  
  //L 09/17/2012 - 18:46:27: "Henry<3><BOT><TERRORIST>" triggered "Got_The_Bomb"
  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" triggered ["](.+)["]\n\u0000$/);
  if (result !== null) {
    return callback({ type: 'trigger', player: module.exports.parsePlayer(result[1]) , event: result[2] });  
  }

};


