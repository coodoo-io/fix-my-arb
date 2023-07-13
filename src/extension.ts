import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.fixMyArb', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      if (path.extname(document.fileName) === '.arb') {
        let text = document.getText();
        let newText = fixErrors(text);
        fs.writeFileSync(document.fileName, newText);
      } else {
        vscode.window.showInformationMessage('This is not an arb file');
      }
    }
  });

  context.subscriptions.push(disposable);
}

function fixErrors(text: any): any {
  let lines = text.split('\n');

  // fix missing bracket
  if (lines[0] !== '{') {
    lines[0] = '{';
    }

  // fix missing bracket
  if (lines[lines.length - 1] !== '}') {
    lines[lines.length - 1] = '}';
  }

  // iterate through lines
  for (let i = 1; i < lines.length - 1; i++) {
    // fix colon space
    let newLine = fixColonSpace(lines[i], i);
    lines[i] = newLine;
    
    // fix missing comma
    if (i < lines.length - 2) {
      let line = fixMissingCommas(lines[i]);
      lines[i] = line;
    }

    // remove last comma
    if (i === lines.length - 2) {
      let line = fixLastComma(lines[i]);
      lines[i] = line;
    }

    // fix quotes
    let line = fixQuotes(lines[i]);
    lines[i] = line;
  }
  
  return lines.join('\n');
}

function fixMissingCommas(line: any): any {
  let lastChar = line[line.length - 1];
  
  if (lastChar !== ',') {
    line += ',';
  }
  
  return line;
}

function fixLastComma(line: any): any {
  let lastChar = line[line.length - 1];
  
  if (lastChar === ',') {
    line = line.slice(0, -1);
  }
  
  return line;
}

function fixQuotes(line: string): string {
  // Split the line on ':'
  let parts = line.split(':');

  // Get the key and value parts
  let key = parts[0];
  let value = parts[1];

  if (parts.length < 2) {
    return line;
  }

  // iterate through key
  let startingIndex = 0;
  for (let i = 0; i < key.length; i++) {
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
  for (let i = 0; i < value.length; i++) {
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

function fixColonSpace(line: any, index: any): any {
  let parts = line.split(':');

  if (parts.length < 2) {
    vscode.window.showInformationMessage('Your arb file has a missing : on line ' + (index + 1) + '\nPlease fix it and try again.');
    return line;
  }

  if (parts.length > 2) {
    vscode.window.showInformationMessage('Your arb file has an extra : on line ' + (index + 1) + '\nPlease fix it and try again.');
    return line;
  }

  let left = parts[0];
  let right = parts[1];

  left = left.trimRight();
  right = right.trimLeft();

  return left + ': ' + right;
}

export {fixColonSpace, fixQuotes, fixErrors, fixMissingCommas, fixLastComma};