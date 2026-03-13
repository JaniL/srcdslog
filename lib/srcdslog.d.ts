import { type ParsedEvent } from "./parseutils";
export type ParseCallback = (result: ParsedEvent | false) => void;
export declare function parse(line: string | Buffer): ParsedEvent | null;
/**
 * @deprecated Use parse(line) for the sync API.
 */
export declare function parseLine(line: string | Buffer, callback: ParseCallback): void;
export declare function parseLine(line: string | Buffer): ParsedEvent | null;
export declare function parseLines(lines: Iterable<string | Buffer>): ParsedEvent[];
