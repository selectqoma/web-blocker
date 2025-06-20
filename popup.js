function createListItem(site) {
  const li = document.createElement('li');
  li.textContent = site.domain;

  const btn = document.createElement('button');
  btn.textContent = 'Unblock';
  btn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'removeSite', id: site.id }, () => {
      li.remove();
    });
  });

  li.appendChild(btn);
  return li;
}

function loadBlockedSites() {
  chrome.storage.local.get('blockedSites', (result) => {
    const list = document.getElementById('blockedList');
    list.innerHTML = '';
    const sites = result.blockedSites || [];
    sites.forEach(site => list.appendChild(createListItem(site)));
  });
}

document.addEventListener('DOMContentLoaded', loadBlockedSites);

document.getElementById('blockBtn').addEventListener('click', () => {
  const domain = document.getElementById('url').value.trim();
  if (!domain) return;

  chrome.runtime.sendMessage({ action: 'addSite', domain }, (response) => {
    if (response && response.success) {
      document.getElementById('url').value = '';
      loadBlockedSites();
    }
  });
});
  