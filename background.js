chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.executeScript(null, {file: "https://cdn.jsdelivr.net/npm/deep-diff@1/dist/deep-diff.min.js"});
  chrome.tabs.executeScript(null, {file: "showIframe.js"});
});
