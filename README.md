srcdslog
========

Srcdslog is node.js module for parsing srcds's logs.

Be warned, this is far from ready.

Usage
-----

    var srcdslog = require('srcdslog');
    
    var info = srcdslog.parseLine('L 11/23/2011 - 14:30:01: "Jarppa!<4><STEAM_0:0:17784529><Blue>" say "asd"");
    console.log(info);

Result:

    { type: 'say',
      player:
       { name: 'Jarppa!',
         id: 4,
         steamid: 'STEAM_0:0:17784529',
         team: 'Blue' },
      text: 'fasd' }

Somes lines aren't recognized by srcdslog yet.
