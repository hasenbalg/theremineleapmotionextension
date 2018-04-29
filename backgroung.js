chrome.runtime.onInstalled.addListener(function() {
    var defaultValues = {
	'volume': 50,
	'pitch':  50,
	'waveform': 50,
	'brightness': 50
	};
    chrome.storage.sync.set(defaultValues, function() {
      console.log("Set the default values to browser storage.");
    });
  });
