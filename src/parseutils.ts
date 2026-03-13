export interface PlayerInfo {
  name: string;
  id: number;
  steamid: string;
  team: string;
}

export interface MetadataSegments {
  raw: string[];
  values: Record<string, string>;
  flags: string[];
}

export type ParsedEvent = {
  type: string;
  [key: string]: unknown;
};

export function parseTime(line: string): Date | false {
  const result = line.match(/^L (\d\d)\/(\d\d)\/(\d\d\d\d) - (\d\d):(\d\d):(\d\d): /);
  if (!result || result.length === 0) {
    return false;
  }

  return new Date(
    parseInt(result[3], 10),
    parseInt(result[1], 10) - 1,
    parseInt(result[2], 10),
    parseInt(result[4], 10),
    parseInt(result[5], 10),
    parseInt(result[6], 10),
    0,
  );
}

export function parsePlayer(line: string): PlayerInfo | false {
  const result = line.match(/^(.*)<(\d+)><([^>]*)><([^>]*)>$/);
  if (!result || result.length === 0) {
    return false;
  }

  return {
    name: result[1],
    id: parseInt(result[2], 10),
    steamid: result[3],
    team: result[4],
  };
}

function parseArgs(args: string): string[] {
  const segments = parseMetadata(args);
  return segments.raw;
}

function parseMetadata(input: string): MetadataSegments {
  const raw = input.match(/\([^)]*\)/g) ?? [];
  const values: Record<string, string> = {};
  const flags: string[] = [];

  for (const segment of raw) {
    const pair = segment.match(/^\(([A-Za-z0-9_]+) "([^"]*)"\)$/);
    if (pair) {
      values[pair[1]] = pair[2];
      continue;
    }

    const flag = segment.match(/^\(([^"()]+)\)$/);
    if (flag) {
      flags.push(flag[1]);
    }
  }

  return { raw, values, flags };
}

function hasMetadata(metadata: MetadataSegments): boolean {
  return metadata.raw.length > 0;
}

function attachMetadata<T extends object>(
  base: T,
  metadata: MetadataSegments,
  includeArgs: boolean,
): T & {
  args?: string[];
  metadata?: Record<string, string>;
  flags?: string[];
} {
  const result: T & {
    args?: string[];
    metadata?: Record<string, string>;
    flags?: string[];
  } = { ...base };

  if (includeArgs && metadata.raw.length > 0) {
    result.args = metadata.raw;
  }

  if (Object.keys(metadata.values).length > 0) {
    result.metadata = metadata.values;
  }

  if (metadata.flags.length > 0) {
    result.flags = metadata.flags;
  }

  return result;
}

export function parseLineInfoSync(line: string): ParsedEvent | null {
  const timestampRemoved = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: (.+)$/);
  if (!timestampRemoved) {
    return null;
  }

  const body = timestampRemoved[1];

  let result = body.match(/^World triggered "([^"]+)"(?: (.+))?$/);
  if (result) {
    if (result[2]) {
      const metadata = parseMetadata(result[2]);
      return attachMetadata(
        { type: "worldtrigger", trigger: result[1] },
        metadata,
        true,
      );
    }
    return { type: "worldtrigger", trigger: result[1] };
  }

  result = body.match(/^Team "([^"]+)" triggered "([^"]+)"(?: (.+))?$/);
  if (result) {
    const metadata = parseMetadata(result[3] ?? "");
    return attachMetadata(
      { type: "teamtrigger", team: result[1], trigger: result[2] },
      metadata,
      true,
    );
  }

  result = body.match(/^rcon from "(.+):(\d+)": command "(.+)"$/);
  if (result) {
    return {
      type: "rcon",
      address: result[1],
      port: parseInt(result[2], 10),
      command: result[3],
    };
  }

  result = body.match(/^"(.+)" picked up item "([^"]+)"(?: (.+))?$/);
  if (result) {
    const metadata = parseMetadata(result[3] ?? "");
    return attachMetadata(
      { type: "picked up", player: parsePlayer(result[1]), item: result[2] },
      metadata,
      true,
    );
  }

  result = body.match(/^"(.+)" committed suicide with "([^"]+)"(?: (.+))?$/);
  if (result) {
    const metadata = parseMetadata(result[3] ?? "");
    const attackerPosition = metadata.values.attacker_position;
    const parsedPosition = attackerPosition
      ? attackerPosition.split(" ").map((value) => parseInt(value, 10))
      : null;

    const base = {
      type: "suicide",
      player: parsePlayer(result[1]),
      with: result[2],
      ...(parsedPosition && parsedPosition.length === 3
        ? {
            attacker_position: [
              parsedPosition[0],
              parsedPosition[1],
              parsedPosition[2],
            ] as [number, number, number],
          }
        : {}),
    };

    if (hasMetadata(metadata)) {
      return attachMetadata(base, metadata, true);
    }

    return {
      type: "suicide",
      player: parsePlayer(result[1]),
      with: result[2],
    };
  }

  result = body.match(/^"(.+)" changed name to "([^"]+)"$/);
  if (result) {
    return {
      type: "changed name",
      player: parsePlayer(result[1]),
      name: result[2],
    };
  }

  result = body.match(/^"(.+)" changed role to "([^"]+)"$/);
  if (result) {
    return { type: "changed role", player: parsePlayer(result[1]), role: result[2] };
  }

  result = body.match(/^"(.+)" connected, address "([^":]+):(\d+)"$/);
  if (result) {
    return {
      type: "connected",
      player: parsePlayer(result[1]),
      ip: result[2],
      port: parseInt(result[3], 10),
    };
  }

  result = body.match(/^"(.+)" STEAM USERID validated$/);
  if (result) {
    return { type: "STEAM USERID validated", player: parsePlayer(result[1]) };
  }

  result = body.match(/^"(.+)" disconnected \(reason "(.+)"\)$/);
  if (result) {
    return {
      type: "disconnected",
      player: parsePlayer(result[1]),
      reason: result[2],
    };
  }

  result = body.match(/^"(.+)" joined team "(.+)"$/);
  if (result) {
    return { type: "joined team", player: parsePlayer(result[1]), team: result[2] };
  }

  result = body.match(/^"(.+)" entered the game$/);
  if (result) {
    return { type: "entered the game", player: parsePlayer(result[1]) };
  }

  result = body.match(/^Started map "(.+)" \(CRC "(.+)"\)$/);
  if (result) {
    return { type: "startedMap", map: result[1], crc: result[2] };
  }

  result = body.match(/^Team "(.+)" current score "(\d+)" with "(\d+)" players$/);
  if (result) {
    return {
      type: "currentScore",
      team: result[1],
      score: parseInt(result[2], 10),
      players: parseInt(result[3], 10),
    };
  }

  result = body.match(/^Team "(.+)" final score "(\d+)" with "(\d+)" players$/);
  if (result) {
    return {
      type: "finalScore",
      team: result[1],
      score: parseInt(result[2], 10),
      players: parseInt(result[3], 10),
    };
  }

  result = body.match(/^"(.+)" spawned as "([^"]+)"$/);
  if (result) {
    return { type: "spawned", player: parsePlayer(result[1]), role: result[2] };
  }

  result = body.match(/^"(.+)" spawned with m_filter on$/);
  if (result) {
    return { type: "spawned", player: parsePlayer(result[1]), m_filter: true };
  }

  result = body.match(/^"(.+)" say "(.+)"$/);
  if (result) {
    return { type: "say", player: parsePlayer(result[1]), text: result[2] };
  }

  result = body.match(/^"(.+)" say_team "(.+)"$/);
  if (result) {
    return { type: "say_team", player: parsePlayer(result[1]), text: result[2] };
  }

  result = body.match(/^"(.+)" position_report (.+)$/);
  if (result) {
    const metadata = parseMetadata(result[2]);
    return attachMetadata(
      { type: "position_report", player: parsePlayer(result[1]), text: parseArgs(result[2]) },
      metadata,
      false,
    );
  }

  result = body.match(/^"(.+)" killed "(.+)" with "([^"]+)"(?: (.+))?$/);
  if (result) {
    const metadata = parseMetadata(result[4] ?? "");
    const isHeadshot = metadata.flags.includes("headshot") || metadata.values.headshot === "1";
    return attachMetadata(
      {
        type: "kill",
        player: parsePlayer(result[1]),
        killed: parsePlayer(result[2]),
        weapon: result[3],
        headshot: isHeadshot,
      },
      metadata,
      true,
    );
  }

  result = body.match(/^"(.+)" triggered "([^"]+)"(?: against "(.+)")?(?: (.+))?$/);
  if (result) {
    const metadata = parseMetadata(result[4] ?? "");
    const parsedAgainst = result[3] ? parsePlayer(result[3]) || result[3] : undefined;
    return attachMetadata(
      {
        type: "trigger",
        player: parsePlayer(result[1]),
        event: result[2],
        ...(parsedAgainst ? { against: parsedAgainst } : {}),
      },
      metadata,
      true,
    );
  }

  return null;
}

export function parseLineInfo(
  line: string,
  callback: (result: ParsedEvent | false) => void,
): void {
  const result = parseLineInfoSync(line);
  callback(result === null ? false : result);
}
