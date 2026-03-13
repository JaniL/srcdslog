import { parseLineInfoSync, type ParsedEvent } from "./parseutils";

export type ParseCallback = (result: ParsedEvent | false) => void;

function normalizeLine(line: string | Buffer): string {
  const text = Buffer.isBuffer(line) ? line.toString("utf8") : line;
  const startingPoint = text.indexOf("L ");
  if (startingPoint === -1) {
    return "";
  }

  return text
    .substring(startingPoint)
    .replace(/(\r\n|\n|\r|\u0000)/gm, "")
    .trim();
}

export function parse(line: string | Buffer): ParsedEvent | null {
  const normalized = normalizeLine(line);
  if (normalized.length === 0) {
    return null;
  }

  return parseLineInfoSync(normalized);
}

/**
 * @deprecated Use parse(line) for the sync API.
 */
export function parseLine(line: string | Buffer, callback: ParseCallback): void;
export function parseLine(line: string | Buffer): ParsedEvent | null;
export function parseLine(
  line: string | Buffer,
  callback?: ParseCallback,
): ParsedEvent | null | void {
  const result = parse(line);

  if (callback) {
    callback(result ?? false);
    return;
  }

  return result;
}

export function parseLines(lines: Iterable<string | Buffer>): ParsedEvent[] {
  const parsed: ParsedEvent[] = [];

  for (const line of lines) {
    const result = parse(line);
    if (result !== null) {
      parsed.push(result);
    }
  }

  return parsed;
}
