chrome.runtime.onInstalled.addListener(function() {
  var tags = {};
  chrome.storage.sync.set({
    "blacklist": tags
  }, function(data) {
    console.log("Current filtered tags: " + tags);
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          urlContains: 'http'
        },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});