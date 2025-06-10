// Default blocked sites
const defaultBlockedSites = [
  'linkedin.com',
  'hotmail.com',
  'gmail.com',
  'instagram.com'
];

// Initialize default blocked sites
function initializeDefaultSites() {
  defaultBlockedSites.forEach((domain, index) => {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        id: index + 1,
        priority: 1,
        action: { type: "block" },
        condition: {
          urlFilter: domain,
          resourceTypes: ["main_frame"]
        }
      }]
    });
  });
}

// Initialize default sites when popup opens
initializeDefaultSites();

document.getElementById("blockBtn").addEventListener("click", async () => {
    const domain = document.getElementById("url").value.trim();
    if (!domain) return;
  
    const ruleId = Date.now(); // simple unique ID
  
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        id: ruleId,
        priority: 1,
        action: { type: "block" },
        condition: {
          urlFilter: domain,
          resourceTypes: ["main_frame"]
        }
      }]
    });
  });
  