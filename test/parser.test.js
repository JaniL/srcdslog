const test = require('node:test');
const assert = require('node:assert/strict');

const srcdslog = require('../lib/srcdslog.js');
const parseutils = require('../lib/parseutils.js');
const fixtures = require('./fixtures/synthetic-lines.js');

test('legacy callback API parses known events', () => {
  let callbackValue;
  srcdslog.parseLine(fixtures.worldTrigger, (result) => {
    callbackValue = result;
  });

  assert.equal(callbackValue.type, 'worldtrigger');
  assert.equal(callbackValue.trigger, 'Round_Start');
});

test('legacy callback API always invokes callback on unmatched lines', () => {
  let called = false;
  let value;

  srcdslog.parseLine(fixtures.unrecognized, (result) => {
    called = true;
    value = result;
  });

  assert.equal(called, true);
  assert.equal(value, false);
});

test('new parse API returns parsed event or null', () => {
  const parsed = srcdslog.parse(fixtures.playerTrigger);
  assert.equal(parsed.type, 'trigger');
  assert.equal(parsed.event, 'shot_fired');
  assert.equal(parsed.metadata.weapon, 'scattergun');

  const missing = srcdslog.parse('not even a log line');
  assert.equal(missing, null);
});

test('parseLine without callback supports sync return for new API', () => {
  const parsed = srcdslog.parseLine(fixtures.pickedUpWithMeta);
  assert.equal(parsed.type, 'picked up');
  assert.equal(parsed.player.name, 'PlayerA');
  assert.equal(parsed.item, 'medkit_small');
  assert.equal(parsed.metadata.healing, '35');
});

test('kill parser handles flags and metadata', () => {
  const parsed = srcdslog.parse(fixtures.killWithFlags);
  assert.equal(parsed.type, 'kill');
  assert.equal(parsed.headshot, true);
  assert.equal(parsed.metadata.attacker_position, '1 2 3');
  assert.equal(parsed.metadata.victim_position, '4 5 6');
});

test('trigger parser handles against target and metadata', () => {
  const parsed = srcdslog.parse(fixtures.playerTriggerAgainst);
  assert.equal(parsed.type, 'trigger');
  assert.equal(parsed.event, 'damage');
  assert.equal(parsed.against.name, 'PlayerB');
  assert.equal(parsed.metadata.damage, '35');
  assert.equal(parsed.metadata.weapon, 'tf_weapon_scattergun');
});

test('parser handles changed name, spawned filter, and suicide metadata', () => {
  const changedName = srcdslog.parse(fixtures.changedName);
  assert.equal(changedName.type, 'changed name');
  assert.equal(changedName.player.name, 'PlayerA');
  assert.equal(changedName.name, 'PlayerA2');

  const spawnedWithFilter = srcdslog.parse(fixtures.spawnedWithFilter);
  assert.equal(spawnedWithFilter.type, 'spawned');
  assert.equal(spawnedWithFilter.player.name, 'PlayerA');
  assert.equal(spawnedWithFilter.m_filter, true);

  const suicideWithCustomkill = srcdslog.parse(fixtures.suicideWithCustomkill);
  assert.equal(suicideWithCustomkill.type, 'suicide');
  assert.equal(suicideWithCustomkill.player.name, 'PlayerA');
  assert.equal(suicideWithCustomkill.metadata.customkill, 'explode');
  assert.deepEqual(suicideWithCustomkill.attacker_position, [1, 2, 3]);
});

test('parseLines returns only recognized events', () => {
  const parsed = srcdslog.parseLines([
    fixtures.unrecognized,
    fixtures.worldTrigger,
    fixtures.playerTrigger,
  ]);

  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].type, 'worldtrigger');
  assert.equal(parsed[1].type, 'trigger');
});

test('parseutils.parsePlayer keeps legacy shape', () => {
  const player = parseutils.parsePlayer('PlayerA<1><[U:1:111111]><Red>');
  assert.deepEqual(player, {
    name: 'PlayerA',
    id: 1,
    steamid: '[U:1:111111]',
    team: 'Red',
  });
});
