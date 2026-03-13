module.exports = {
  worldTrigger: 'L 01/02/2026 - 10:11:12: World triggered "Round_Start"',
  playerTrigger: 'L 01/02/2026 - 10:11:12: "PlayerA<1><[U:1:111111]><Red>" triggered "shot_fired" (weapon "scattergun")',
  playerTriggerAgainst:
    'L 01/02/2026 - 10:11:12: "PlayerA<1><[U:1:111111]><Red>" triggered "damage" against "PlayerB<2><[U:1:222222]><Blue>" (damage "35") (weapon "tf_weapon_scattergun")',
  pickedUpWithMeta:
    'L 01/02/2026 - 10:11:12: "PlayerA<1><[U:1:111111]><Red>" picked up item "medkit_small" (healing "35")',
  killWithFlags:
    'L 01/02/2026 - 10:11:12: "PlayerA<1><[U:1:111111]><Red>" killed "PlayerB<2><[U:1:222222]><Blue>" with "sniperrifle" (headshot) (attacker_position "1 2 3") (victim_position "4 5 6")',
  changedName:
    'L 01/02/2026 - 10:11:12: "PlayerA<1><[U:1:111111]><Red>" changed name to "PlayerA2"',
  spawnedWithFilter:
    'L 01/02/2026 - 10:11:12: "PlayerA<1><[U:1:111111]><Red>" spawned with m_filter on',
  suicideWithCustomkill:
    'L 01/02/2026 - 10:11:12: "PlayerA<1><[U:1:111111]><Red>" committed suicide with "world" (customkill "explode") (attacker_position "1 2 3")',
  unrecognized: 'L 01/02/2026 - 10:11:12: This is not a valid event shape',
};
