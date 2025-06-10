// Default blocked sites
const defaultBlockedSites = [
  'linkedin.com',
  'hotmail.com',
  'gmail.com',
  'instagram.com'
];

// Initialize default blocked sites
function initializeDefaultSites() {
  const rules = defaultBlockedSites.map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: domain,
      resourceTypes: ["main_frame"]
    }
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(rule => rule.id),
    addRules: rules
  });
}

// Initialize when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  initializeDefaultSites();
});
  