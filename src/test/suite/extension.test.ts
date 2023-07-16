import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { fixColonSpace, fixLastComma, fixMissingCommas, fixQuotes, warnUsedNumberAsFirstChar } from '../../extension';

suite('warnUsedNumberAsFirstChar Test Suite', () => {
    let showInformationMessageStub: sinon.SinonStub;

    setup(() => {
        // Create the stub once in the setup function
        showInformationMessageStub = sinon.stub(vscode.window, 'showInformationMessage');
    });

    teardown(() => {
        // Restore the original method after each test
        showInformationMessageStub.restore();
    });

    test('should not warn if the first character of a line is not a number', () => {
        const line = 'a line with no number at the start';
        warnUsedNumberAsFirstChar(line, 0);
        assert(showInformationMessageStub.notCalled);
    });

    test('should warn if the first character of a line is a number', () => {
        const line = '1 line with a number at the start';
        warnUsedNumberAsFirstChar(line, 0);
        assert(showInformationMessageStub.calledOnce);
    });
});

suite('fixMissingCommas Test Suite', () => {
  test('should add a comma to a line that doesn\'t end with a comma', () => {
    const line = '"key": "value"';
    const result = fixMissingCommas(line);
    assert.strictEqual(result, '"key": "value",');
  });

  test('should not add a comma to a line that already ends with a comma', () => {
    const line = '"key": "value"';
    const result = fixMissingCommas(line);
    assert.strictEqual(result, '"key": "value",');
  });
});

suite('fixLastComma Test Suite', () => {
  test('should remove a comma from a line that ends with a comma', () => {
    const line = '"key": "value",';
    const result = fixLastComma(line);
    assert.strictEqual(result, '"key": "value"');
  });

  test('should not remove anything from a line that does not end with a comma', () => {
    const line = '"key": "value"';
    const result = fixLastComma(line);
    assert.strictEqual(result, '"key": "value"');
  });
});

suite('fixQuotes Test Suite', () => {
  test('should add quotes around a key and value if they are missing', () => {
    const line = 'key: value';
    const result = fixQuotes(line);
    assert.strictEqual(result, '"key": "value"');
  });

  test('should not add extra quotes if they are already present', () => {
    const line = '"key": "value"';
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

  test('should handle a line with a comma at the end', () => {
    const line = 'key: value,';
    const result = fixQuotes(line);
    assert.strictEqual(result, '"key": "value",');
  });
});

suite('fixColonSpace Test Suite', () => {
  let showInformationMessageStub: sinon.SinonStub;

  setup(() => {
    showInformationMessageStub = sinon.stub(vscode.window, 'showInformationMessage');
  });

  teardown(() => {
    showInformationMessageStub.restore();
  });

  test('should not warn if a line has exactly one colon', () => {
    const line = 'key: value';
    fixColonSpace(line, 0);
    assert(showInformationMessageStub.notCalled);
  });

  test('should warn if a line has no colon', () => {
    const line = 'key value';
    fixColonSpace(line, 0);
    assert(showInformationMessageStub.calledOnce);
  });

  test('should warn if a line has more than one colon', () => {
    const line = 'key: value: extra';
    fixColonSpace(line, 0);
    assert(showInformationMessageStub.calledOnce);
  });

  test('should remove space before colon and ensure one space after colon', () => {
    const line = 'key :value';
    const result = fixColonSpace(line, 0);
    assert.strictEqual(result, 'key: value');
  });
});
