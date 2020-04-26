chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.name === 'download') {
        chrome.permissions.request({
            permissions: ['downloads']
        }, function(granted) {
            if (granted) {
                try {
                    var blob = new Blob([request.value], {
                        type: 'application/json;charset=utf-8'
                    });

                    chrome.downloads.download({
                        url: URL.createObjectURL(blob),
                        filename: request.filename,
                        saveAs: true
                    });
                } catch (err) {
                    chrome.runtime.sendMessage({
                        name: 'satus-error',
                        value: err
                    });
                }
            } else {
                chrome.runtime.sendMessage({
                    name: 'satus-error',
                    value: 'Permission is not granted'
                });
            }
        });
    }
});