function update(container) {
    var item = this.history[this.history.length - 1],
        id = item.appearanceKey,
        data = JSON.parse(Satus.storage.get('data') || '{}'),
        list = {
            section: {
                type: 'section'
            }
        };

    document.body.dataset.appearance = id;
    container.dataset.appearance = id;

    document.querySelector('.satus-text--title').innerText = Satus.locale.getMessage(item.label) || 'Lists';

    container.querySelector('.satus-scrollbar__content').innerHTML = '';

    if (item.appearanceKey === 'home') {
        if (Object.keys(data).length === 0) {
            list.section = {
                type: 'section',

                0: {
                    type: 'folder',
                    label: 'My Tasks',
                    appearanceKey: 'list',
                    storage_key: 0
                }
            };

            data[0] = {
                type: 'folder',
                label: 'My Tasks'
            };

            Satus.storage.set('data', JSON.stringify(data));
        } else {
            for (var key in data) {
                list.section[key] = data[key];
                list.section[key].appearanceKey = 'list';
                list.section[key].storage_key = key;
            }
        }
    } else if (item.appearanceKey === 'list') {
        if (Object.keys(item).length === 4) {
            list.section.class = 'satus-section--message';

            list.section.message = {
                type: 'text',
                innerText: 'No tasks'
            };
        } else {
            for (var key in data[item.storage_key]) {
                if (typeof data[item.storage_key][key] === 'object') {
                    list.section[key] = data[item.storage_key][key];
                    list.section[key].dataset = {
                        key: key
                    };
                    list.section[key].onchange = function() {
                        var main = document.querySelector('.satus-main'),
                            history_item = main.history[main.history.length - 1],
                            data = JSON.parse(Satus.storage.get('data') || '{}');

                        data[history_item.storage_key][this.dataset.key].value = this.querySelector('input').checked;

                        Satus.storage.set('data', JSON.stringify(data));
                    };
                }
            }
        }
    }

    Satus.render(list, container.querySelector('.satus-scrollbar__content'));
}

function create() {
    var main = document.querySelector('.satus-main'),
        history_item = main.history[main.history.length - 1],
        data = JSON.parse(Satus.storage.get('data') || '{}'),
        value = document.querySelector('.satus-text-field--value').value;

    if (history_item.appearanceKey === 'home') {
        var key = Object.keys(data).length;

        data[key] = {
            type: 'folder',
            label: value
        };

        Satus.storage.set('data', JSON.stringify(data));

        data[key].appearanceKey = 'list';
        data[key].storage_key = key;

        Satus.render(data[key], document.querySelector('.satus-main .satus-section'));
    } else {
        var folder_key = history_item.storage_key,
            task_key = Object.keys(data[folder_key]).length;

        data[folder_key][task_key] = {
            type: 'switch',
            label: value
        };

        Satus.storage.set('data', JSON.stringify(data));

        data[folder_key][task_key].storage_key = task_key;

        if (document.querySelector('.satus-main .satus-section--message .satus-text')) {
            document.querySelector('.satus-main .satus-section--message .satus-text').remove();
        }

        Satus.render(data[folder_key][task_key], document.querySelector('.satus-main .satus-section'));
    }
}