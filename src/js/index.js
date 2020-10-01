/*---------------------------------------------------------------
>>> INDEX
---------------------------------------------------------------*/

satus.storage.import(function() {
    satus.locale.import(satus.storage.get('language'), function() {
        satus.modules.updateStorageKeys(Menu, function() {
            if (location.href.indexOf('action=import') !== -1) {
                importData();
            } else if (location.href.indexOf('action=export') !== -1) {
                exportData();
            } else {
                satus.render(Menu);
            }
        });
    });
});
