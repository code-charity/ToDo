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

satus.storage.import(function (items) {
	var language = items.language;

	if (!language) {
		language = window.navigator.language;
	}

	satus.locale.import(language, function () {
		satus.render(extension.skeleton, undefined, undefined, undefined, undefined, true);

		if (!extension.exportSettings()) {
			if (Array.isArray(satus.storage.get('lists'))) {
				extension.lists = satus.storage.get('lists');

				satus.render(extension.skeleton, extension.skeleton.rendered, undefined, true);
			} else if (satus.storage.get('encrypted') === true && satus.isString(satus.storage.get('lists'))) {
				chrome.storage.session.get('password', async function (items) {
					var lists = false;

					if (items.password) {
						try {
							lists = JSON.parse(await satus.decrypt(satus.storage.get('lists'), items.password));
						} catch (error) {}
					}

					if (lists) {
						extension.password = items.password;
						extension.lists = lists;

						satus.render(extension.skeleton, extension.skeleton.rendered, undefined, true);
					} else {
						extension.crypt(false, satus.storage.get('lists'), function (mode, data) {
							extension.lists = data;

							satus.render(extension.skeleton, extension.skeleton.rendered, undefined, true);
						});
					}
				});
			} else {
				satus.render(extension.skeleton, extension.skeleton.rendered, undefined, true);
			}
		}

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