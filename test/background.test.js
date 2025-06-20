const assert = require('node:assert/strict');
const { test, beforeEach } = require('node:test');

function createChromeMock() {
  return {
    storage: {
      local: {
        _store: {},
        async get(keys) {
          if (Array.isArray(keys)) {
            const res = {};
            for (const k of keys) res[k] = this._store[k];
            return res;
          }
          return { [keys]: this._store[keys] };
        },
        async set(obj) {
          Object.assign(this._store, obj);
        }
      }
    },
    declarativeNetRequest: {
      calls: [],
      async updateDynamicRules(args) {
        this.calls.push(args);
      }
    },
    runtime: {
      onInstalled: { addListener() {} },
      onStartup: { addListener() {} },
      onMessage: { addListener() {} }
    }
  };
}

let bg;

beforeEach(() => {
  global.chrome = createChromeMock();
  delete require.cache[require.resolve('../background.js')];
  bg = require('../background.js');
});

test('addSite adds a domain and updates rules', async () => {
  const store = global.chrome.storage.local._store;
  store[bg.STORAGE_KEY] = [];
  store[bg.NEXT_ID_KEY] = 1;

  await bg.addSite('example.com');

  assert.deepEqual(store[bg.STORAGE_KEY], [{ id: 1, domain: 'example.com' }]);
  assert.equal(store[bg.NEXT_ID_KEY], 2);

  const calls = global.chrome.declarativeNetRequest.calls;
  assert.equal(calls.length, 1);
  assert.equal(calls[0].addRules[0].id, 1);
  assert.equal(calls[0].addRules[0].condition.urlFilter, 'example.com');
});

test('removeSite removes a domain and updates rules', async () => {
  const store = global.chrome.storage.local._store;
  store[bg.STORAGE_KEY] = [
    { id: 1, domain: 'example.com' },
    { id: 2, domain: 'test.com' }
  ];

  await bg.removeSite(1);

  assert.deepEqual(store[bg.STORAGE_KEY], [{ id: 2, domain: 'test.com' }]);

  const calls = global.chrome.declarativeNetRequest.calls;
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].removeRuleIds, [1]);
});
