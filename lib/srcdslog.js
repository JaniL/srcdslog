"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = parse;
exports.parseLine = parseLine;
exports.parseLines = parseLines;
const parseutils_1 = require("./parseutils");
function normalizeLine(line) {
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
function parse(line) {
    const normalized = normalizeLine(line);
    if (normalized.length === 0) {
        return null;
    }
    return (0, parseutils_1.parseLineInfoSync)(normalized);
}
function parseLine(line, callback) {
    const result = parse(line);
    if (callback) {
        callback(result ?? false);
        return;
    }
    return result;
}
function parseLines(lines) {
    const parsed = [];
    for (const line of lines) {
        const result = parse(line);
        if (result !== null) {
            parsed.push(result);
        }
    }
    return parsed;
}
