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
export declare function parseTime(line: string): Date | false;
export declare function parsePlayer(line: string): PlayerInfo | false;
export declare function parseLineInfoSync(line: string): ParsedEvent | null;
export declare function parseLineInfo(line: string, callback: (result: ParsedEvent | false) => void): void;
