"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixLastComma = exports.fixMissingCommas = exports.fixErrors = exports.fixQuotes = exports.fixColonSpace = exports.activate = void 0;
var vscode = require("vscode");
var fs = require("fs");
var path = require("path");
function activate(context) {
    var disposable = vscode.commands.registerCommand('extension.fixMyArb', function () {
        var editor = vscode.window.activeTextEditor;
        if (editor) {
            var document_1 = editor.document;
            if (path.extname(document_1.fileName) === '.arb') {
                var text = document_1.getText();
                var newText = fixErrors(text);
                fs.writeFileSync(document_1.fileName, newText);
            }
            else {
                vscode.window.showInformationMessage('This is not an arb file');
            }
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function fixErrors(text) {
    var lines = text.split('\n');
    // fix missing bracket
    if (lines[0] !== '{') {
        lines[0] = '{';
    }
    // fix missing bracket
    if (lines[lines.length - 1] !== '}') {
        lines[lines.length - 1] = '}';
    }
    // iterate through lines
    for (var i = 1; i < lines.length - 1; i++) {
        // fix colon space
        var newLine = fixColonSpace(lines[i], i);
        lines[i] = newLine;
        // fix missing comma
        if (i < lines.length - 2) {
            var line_1 = fixMissingCommas(lines[i]);
            lines[i] = line_1;
        }
        // remove last comma
        if (i === lines.length - 2) {
            var line_2 = fixLastComma(lines[i]);
            lines[i] = line_2;
        }
        // fix quotes
        var line = fixQuotes(lines[i]);
        lines[i] = line;
    }
    return lines.join('\n');
}
exports.fixErrors = fixErrors;
function fixMissingCommas(line) {
    var lastChar = line[line.length - 1];
    if (lastChar !== ',') {
        line += ',';
    }
    return line;
}
exports.fixMissingCommas = fixMissingCommas;
function fixLastComma(line) {
    var lastChar = line[line.length - 1];
    if (lastChar === ',') {
        line = line.slice(0, -1);
    }
    return line;
}
exports.fixLastComma = fixLastComma;
function fixQuotes(line) {
    // Split the line on ':'
    var parts = line.split(':');
    // Get the key and value parts
    var key = parts[0];
    var value = parts[1];
    if (parts.length < 2) {
        return line;
    }
    // iterate through key
    var startingIndex = 0;
    for (var i = 0; i < key.length; i++) {
        // ignore whitespace
        if (key[i].match(/^[a-zA-Z0-9_]+$/)) {
            startingIndex = i;
            break;
        }
    }
    if (key[startingIndex - 1] !== '"') {
        key = key.slice(0, startingIndex) + '"' + key.slice(startingIndex);
    }
    if (key[key.length - 1] !== '"') {
        key += '"';
    }
    // iterate through value
    startingIndex = 0;
    for (var i = 0; i < value.length; i++) {
        // ignore whitespace
        if (value[i].match(/^[a-zA-Z0-9_]+$/)) {
            startingIndex = i;
            break;
        }
    }
    if (value[startingIndex - 1] !== '"') {
        value = value.slice(0, startingIndex) + '"' + value.slice(startingIndex);
    }
    if (value[value.length - 1] === ',' && value[value.length - 2] !== '"') {
        value = value.slice(0, -1) + '"' + value.slice(-1);
    }
    // Return the fixed line
    return key + ':' + value;
}
exports.fixQuotes = fixQuotes;
function fixColonSpace(line, index) {
    var parts = line.split(':');
    if (parts.length < 2) {
        vscode.window.showInformationMessage('Your arb file has a missing : on line ' + (index + 1) + '\nPlease fix it and try again.');
        return line;
    }
    if (parts.length > 2) {
        vscode.window.showInformationMessage('Your arb file has an extra : on line ' + (index + 1) + '\nPlease fix it and try again.');
        return line;
    }
    var left = parts[0];
    var right = parts[1];
    left = left.trimRight();
    right = right.trimLeft();
    return left + ': ' + right;
}
exports.fixColonSpace = fixColonSpace;
