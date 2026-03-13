srcdslog
========

Srcdslog is a Node.js module for parsing SRCDS logs.

Install
-------

```bash
npm install
```

Build
-----

```bash
npm run build
```

API
---

New API (recommended):

```js
const srcdslog = require('./lib/srcdslog.js');

const result = srcdslog.parse(
  'L 01/02/2026 - 10:11:12: "PlayerA<1><[U:1:111111]><Red>" triggered "shot_fired" (weapon "scattergun")'
);

console.log(result);
```

Legacy callback API (still supported):

```js
const srcdslog = require('./lib/srcdslog.js');

srcdslog.parseLine(
  'L 01/02/2026 - 10:11:12: "PlayerA<1><[U:1:111111]><Red>" say "hello"',
  (info) => {
    console.log(info);
  }
);
```

When a line is not recognized:
- `parse(line)` returns `null`
- `parseLine(line, callback)` invokes callback with `false`

Tests
-----

```bash
npm test
```
