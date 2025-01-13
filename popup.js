document.addEventListener("DOMContentLoaded", () => {
  const blacklistInput = document.getElementById("blacklist");

  // Load current rules
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    const domains = rules.map(rule => rule.condition.urlFilter);
    blacklistInput.value = domains.join("\n");
  });

  // Save updated blacklist
  document.getElementById("save").addEventListener("click", () => {
    const domains = blacklistInput.value
      .split("\n")
      .map(domain => domain.trim())
      .filter(domain => domain);

    // Create new rules
    const newRules = domains.map((domain, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: domain, resourceTypes: ["main_frame"] }
    }));

    // Update dynamic rules
    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const existingRuleIds = existingRules.map(rule => rule.id);
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: existingRuleIds,
          addRules: newRules
        },
        () => {
          console.log("Blacklist updated successfully!");
        }
      );
    });
  });
});