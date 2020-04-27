Satus.storage.import(function() {
    if (!Satus.storage.get('legacy') && Satus.storage.get('lists')) {
        var lists = Satus.storage.get('lists'),
            data = JSON.parse(Satus.storage.get('data') || '{}');

        for (var i in lists) {
            if (typeof lists[i] === 'object') {
                data[i] = {
                    type: 'folder',
                    label: lists[i].name
                };

                for (var j in lists[i].items) {
                    if (typeof lists[i].items[j] === 'object') {
                        data[i][j] = {
                            type: 'switch',
                            label: lists[i].items[j].name,
                            value: lists[i].items[j].value
                        };
                    }
                }
            }
        }

        Satus.storage.set('data', JSON.stringify(data));
        Satus.storage.set('legacy', true);
    }

    Satus.modules.updateStorageKeys(Menu, function() {
        Satus.render(Menu, document.body);
    });
});