import * as assert from 'assert';
import * as vscode from 'vscode';
import { fixColonSpace, fixQuotes } from '../../extension';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  suite('fixColonSpace', () => {
    test('should handle a line with a single colon and no extra spaces', () => {
      const line = 'key:value';
      const result = fixColonSpace(line, 0);
      assert.strictEqual(result, 'key: value');
    });

    test('should handle a line with a single colon and extra spaces', () => {
      const line = 'key :value';
      const result = fixColonSpace(line, 0);
      assert.strictEqual(result, 'key: value');
    });

    test('should return the original line if there is no colon', () => {
      const line = 'keyvalue';
      const result = fixColonSpace(line, 0);
      assert.strictEqual(result, line);
    });

    test('should return the original line if there are multiple colons', () => {
      const line = 'key:value:extra';
      const result = fixColonSpace(line, 0);
      assert.strictEqual(result, line);
    });
  });

  suite('fixQuotes', () => {
    test('should handle a line with no quotes', () => {
      const line = 'key: value';
      const result = fixQuotes(line);
      assert.strictEqual(result, '"key": "value"');
    });

    test('should handle a line with quotes only around the key', () => {
      const line = '"key": value';
      const result = fixQuotes(line);
      assert.strictEqual(result, '"key": "value"');
    });

    test('should handle a line with quotes only around the value', () => {
      const line = 'key: "value"';
      const result = fixQuotes(line);
      assert.strictEqual(result, '"key": "value"');
    });

    test('should handle a line with quotes around both the key and value', () => {
      const line = '"key": "value"';
      const result = fixQuotes(line);
      assert.strictEqual(result, '"key": "value"');
    });
  });
});
