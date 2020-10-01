/*---------------------------------------------------------------
>>> INDEX
---------------------------------------------------------------*/

satus.storage.import(function() {
    satus.locale.import(function() {
        satus.modules.updateStorageKeys(Menu, function() {
            satus.render(Menu);
        });
    });
});
