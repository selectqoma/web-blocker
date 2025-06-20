// Default blocked sites
const defaultBlockedSites = [
  'linkedin.com',
  'hotmail.com',
  'gmail.com',
  'instagram.com'
];

const STORAGE_KEY = 'blockedSites';
const NEXT_ID_KEY = 'nextRuleId';

/**
 * Build and apply dynamic rules for all sites.
 * @param {Array<{id:number,domain:string}>} sites
 */
async function buildRules(sites) {
  const rules = sites.map(site => ({
    id: site.id,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: site.domain,
      resourceTypes: ['main_frame']
    }
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(r => r.id),
    addRules: rules
  });
}

/**
 * Add a domain to storage and create a dynamic rule for it.
 * @param {string} domain
 */
async function addSite(domain) {
  const result = await chrome.storage.local.get([STORAGE_KEY, NEXT_ID_KEY]);
  const sites = result[STORAGE_KEY] || [];
  let nextId = result[NEXT_ID_KEY] || 1;
  const id = nextId++;
  sites.push({ id, domain });
  await chrome.storage.local.set({
    [STORAGE_KEY]: sites,
    [NEXT_ID_KEY]: nextId
  });

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      id,
      priority: 1,
      action: { type: 'block' },
      condition: {
        urlFilter: domain,
        resourceTypes: ['main_frame']
      }
    }]
  });
}

/**
 * Remove a site by rule id from storage and dynamic rules.
 * @param {number} id
 */
async function removeSite(id) {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const sites = (result[STORAGE_KEY] || []).filter(site => site.id !== id);
  await chrome.storage.local.set({ [STORAGE_KEY]: sites });
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [id] });
}

/**
 * Load stored sites and rebuild all rules.
 */
async function loadStoredSites() {
  const result = await chrome.storage.local.get([STORAGE_KEY, NEXT_ID_KEY]);
  const sites = result[STORAGE_KEY];
  if (Array.isArray(sites) && sites.length) {
    await buildRules(sites);
    if (typeof result[NEXT_ID_KEY] !== 'number') {
      const maxId = Math.max(...sites.map(s => s.id));
      await chrome.storage.local.set({ [NEXT_ID_KEY]: maxId + 1 });
    }
  } else if (typeof result[NEXT_ID_KEY] !== 'number') {
    await chrome.storage.local.set({ [NEXT_ID_KEY]: 1 });
  }
}

// Initialize when extension is installed
chrome.runtime.onInstalled.addListener(async () => {
  const initialSites = defaultBlockedSites.map((domain, index) => ({
    id: index + 1,
    domain
  }));
  await chrome.storage.local.set({
    [STORAGE_KEY]: initialSites,
    [NEXT_ID_KEY]: initialSites.length + 1
  });
  await buildRules(initialSites);
});

// Rebuild rules on startup and when the service worker loads
chrome.runtime.onStartup.addListener(loadStoredSites);
loadStoredSites();

// Expose helper functions via message passing
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'addSite') {
    addSite(message.domain).then(() => sendResponse({ success: true }));
    return true;
  }
  if (message.action === 'removeSite') {
    removeSite(message.id).then(() => sendResponse({ success: true }));
    return true;
  }
});
  