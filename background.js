/*--------------------------------------------------------------
>>> BACKGROUND
--------------------------------------------------------------*/

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	var action = message.action;

	if (action === 'options-page-connected') {
		sendResponse({
			isPopup: sender.hasOwnProperty('tab') === false
		});
	}
});