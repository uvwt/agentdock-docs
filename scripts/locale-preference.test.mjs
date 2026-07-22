import assert from 'node:assert/strict';
import test from 'node:test';

import {
  browserPrefersChinese,
  choosePreferredLocale,
  normalizeLocale,
} from '../src/clientModules/localePreference.mjs';

test('normalizeLocale maps supported browser language tags', () => {
  assert.equal(normalizeLocale('en-US'), 'en');
  assert.equal(normalizeLocale('zh-CN'), 'zh-CN');
  assert.equal(normalizeLocale('zh-Hans'), 'zh-CN');
  assert.equal(normalizeLocale('zh-TW'), 'zh-CN');
  assert.equal(normalizeLocale('fr-FR'), null);
  assert.equal(normalizeLocale(null), null);
});

test('browserPrefersChinese checks the complete browser language list', () => {
  assert.equal(browserPrefersChinese(['en-US', 'zh-CN']), true);
  assert.equal(browserPrefersChinese(['en-US', 'fr-FR']), false);
});

test('first English visit follows the browser language', () => {
  assert.equal(
    choosePreferredLocale({
      currentLocale: 'en',
      storedLocale: null,
      browserLanguages: ['zh-CN', 'en-US'],
    }),
    'zh-CN',
  );
  assert.equal(
    choosePreferredLocale({
      currentLocale: 'en',
      storedLocale: null,
      browserLanguages: ['en-US'],
    }),
    'en',
  );
});

test('a direct localized URL is treated as an explicit choice', () => {
  assert.equal(
    choosePreferredLocale({
      currentLocale: 'zh-CN',
      storedLocale: null,
      browserLanguages: ['en-US'],
    }),
    'zh-CN',
  );
});

test('a stored manual choice overrides the browser language', () => {
  assert.equal(
    choosePreferredLocale({
      currentLocale: 'en',
      storedLocale: 'en',
      browserLanguages: ['zh-CN'],
    }),
    'en',
  );
  assert.equal(
    choosePreferredLocale({
      currentLocale: 'zh-CN',
      storedLocale: 'zh-CN',
      browserLanguages: ['en-US'],
    }),
    'zh-CN',
  );
});
