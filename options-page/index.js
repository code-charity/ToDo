/*--------------------------------------------------------------
>>> USER INTERFACE
----------------------------------------------------------------
# Global variable
# Initialization
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GLOBAL VARIABLE
--------------------------------------------------------------*/

var extension = {
	lists: []
};


/*--------------------------------------------------------------
# INITIALIZATION
--------------------------------------------------------------*/

satus.storage.attributes = {
	theme: true
};

satus.storage.import(function (items) {
	var language = items.language;

	if (!language) {
		language = window.navigator.language;
	}

	if (items.theme === 'dark') {
		document.body.setAttribute('theme', 'dark');
	}

	satus.locale.import(language, function () {
		if (extension.lists.length > 0) {
			satus.render(extension.skeleton);
		} else if (Array.isArray(satus.storage.get('lists'))) {
			extension.lists = satus.storage.get('lists');

			satus.render(extension.skeleton);
		} else if (satus.storage.get('encrypted') === true && typeof satus.storage.get('lists') === 'string') {
			extension.crypt(false, satus.storage.get('lists'), function (mode, data) {
				extension.lists = data;

				satus.render(extension.skeleton);
			});
		} else {
			satus.render(extension.skeleton);
		}

		extension.exportSettings();
		extension.importSettings();
	}, '_locales/');
});

chrome.runtime.sendMessage({
	action: 'options-page-connected'
}, function (response) {
	if (response.isPopup === false) {
		document.body.setAttribute('tab', '');
	}
});