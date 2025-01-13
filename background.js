// Blacklist of domains
let blacklist = [
  "example-ads.com",
  "malicious-site.com",
  "ad-redirect.net"
];

// Listen to network requests
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);

    // Check if the domain is in the blacklist
    if (blacklist.some(domain => url.hostname.includes(domain))) {
      console.log(`Blocked: ${details.url}`);
      return { cancel: true };
    }
    return {};
  },
  { urls: ["<all_urls>"] }, // Listen to all URLs
  ["blocking"]
);

// Listen for updates to the blacklist
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateBlacklist") {
    blacklist = message.data;
    sendResponse({ status: "Blacklist updated" });
  }
});