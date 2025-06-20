document.getElementById("blockBtn").addEventListener("click", () => {
  const domain = document.getElementById("url").value.trim();
  if (!domain) return;

  chrome.runtime.sendMessage({ action: "addSite", domain });
});
  