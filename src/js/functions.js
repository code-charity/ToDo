function change(old_index, new_index) {
    var main = document.querySelector('.satus-main'),
        data = JSON.parse(Satus.storage.get('data') || '{}'),
        data2 = data,
        clone;

    if (main.history.length > 1) {
        data = data[main.history[main.history.length - 1].storage_key];
    }

    old_index2 = Number(document.querySelectorAll('.satus-main .satus-list li')[old_index].querySelector('*').dataset.key);
    new_index2 = Number(document.querySelectorAll('.satus-main .satus-list li')[new_index].querySelector('*').dataset.key);

    clone = Object.assign(data[old_index2]);

    data[old_index2] = data[new_index2];
    data[new_index2] = clone;

    Satus.storage.set('data', JSON.stringify(data2));
}

function remove() {
    var main = document.querySelector('.satus-main'),
        history_item = main.history[main.history.length - 1],
        data = JSON.parse(Satus.storage.get('data') || '{}');

    if (main.history.length > 1) {
        var key = this.parentNode.querySelector('.satus-switch').dataset.key;

        delete data[history_item.storage_key][key];
        delete history_item[key];

        Satus.storage.set('data', JSON.stringify(data));

        var object = Object.assign(history_item);

        delete object.type;

        document.querySelector('.satus-scrollbar__content').innerHTML = '';

        update();
    } else {
        delete data[this.parentNode.querySelector('.satus-folder').dataset.key];

        Satus.storage.set('data', JSON.stringify(data));

        document.querySelector('.satus-scrollbar__content').innerHTML = '';

        update();
    }
}

function update(container) {
    var self = (this === window ? document.querySelector('.satus-main') : this),
        item = self.history[self.history.length - 1],
        id = item.appearanceKey,
        data = JSON.parse(Satus.storage.get('data') || '{}'),
        ui = {
            list: {
                type: 'list',
                compact: true,
                sortable: true,
                onchange: change
            }
        };

    if (!Satus.isset(container)) {
        container = document.querySelector('.satus-main__container');
    }

    document.body.dataset.appearance = id;
    container.dataset.appearance = id;

    document.querySelector('.satus-text--title').innerText = Satus.locale.getMessage(item.label) || 'Lists';

    container.querySelector('.satus-scrollbar__content').innerHTML = '';

    if (item.appearanceKey === 'home') {
        if (Object.keys(data).length === 0) {
            ui.list = {
                type: 'list',
                compact: true,
                sortable: true,
                onchange: change,

                0: {
                    type: 'section',

                    folder: {
                        type: 'folder',
                        label: 'My Tasks',
                        before: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
                        appearanceKey: 'list',
                        storage_key: 0
                    },


                    button: {
                        type: 'button',
                        class: 'satus-button--remove',
                        before: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
                        onclick: remove
                    }
                }
            };

            data[0] = {
                type: 'folder',
                label: 'My Tasks'
            };

            Satus.storage.set('data', JSON.stringify(data));

            data[0].storage_key = 0;
        } else {
            for (var key in data) {
                ui.list[key] = {
                    type: 'section'
                };
                ui.list[key].folder = data[key];
                ui.list[key].folder.appearanceKey = 'list';
                ui.list[key].folder.storage_key = key;
                ui.list[key].folder.dataset = {
                    key: key
                };
                ui.list[key].folder.before = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>';

                ui.list[key].button = {
                    type: 'button',
                    class: 'satus-button--remove',
                    before: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
                    onclick: remove
                };
            }
        }
    } else if (item.appearanceKey === 'list') {
        var has_tasks = false;

        for (var key in item) {
            if (item[key].type === 'switch') {
                has_tasks = true;
            }
        }

        if (has_tasks === false) {
            ui.list.class = 'satus-list--message';

            ui.list.message = {
                type: 'text',
                innerText: 'No tasks'
            };
        } else {
            for (var key in data[item.storage_key]) {
                if (typeof data[item.storage_key][key] === 'object') {
                    ui.list[key] = {
                        type: 'section'
                    };
                    ui.list[key].folder = data[item.storage_key][key];
                    ui.list[key].folder.class = 'satus-switch--checkbox';
                    ui.list[key].folder.dataset = {
                        key: key
                    };
                    ui.list[key].folder.onchange = function() {
                        var main = document.querySelector('.satus-main'),
                            history_item = main.history[main.history.length - 1],
                            data = JSON.parse(Satus.storage.get('data') || '{}');

                        data[history_item.storage_key][this.dataset.key].value = this.querySelector('input').checked;
                        Satus.storage.set('data', JSON.stringify(data));
                    };

                    ui.list[key].button = {
                        type: 'button',
                        class: 'satus-button--remove',
                        before: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
                        onclick: remove
                    };
                }
            }
        }
    }

    Satus.render(ui, container.querySelector('.satus-scrollbar__content'));
}

function create() {
    var main = document.querySelector('.satus-main'),
        history_item = main.history[main.history.length - 1],
        data = JSON.parse(Satus.storage.get('data') || '{}'),
        value = document.querySelector('.satus-text-field--value').value;

    if (history_item.appearanceKey === 'home') {
        var key = new Date().getTime();

        data[key] = {
            type: 'folder',
            label: value
        };

        Satus.storage.set('data', JSON.stringify(data));

        history_item[key] = {
            type: 'section',

            folder: {
                type: 'folder',
                label: value,
                before: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
                appearanceKey: 'list',
                storage_key: key
            }
        };

        document.querySelector('.satus-scrollbar__content').innerHTML = '';

        update();
    } else {
        var folder_key = history_item.storage_key,
            task_key = new Date().getTime();

        data[folder_key][task_key] = {
            type: 'switch',
            class: 'satus-switch--checkbox',
            label: value
        };

        Satus.storage.set('data', JSON.stringify(data));

        data[folder_key][task_key] = {
            type: 'section',

            folder: {
                type: 'folder',
                class: 'satus-switch--checkbox',
                label: value,
                before: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
                storage_key: task_key
            }
        };

        for (var i = document.querySelectorAll('body > *:not(script)').length - 1; i > -1; i++) {
            document.querySelectorAll('body > *:not(script)')[i].remove();
        }

        //Satus.render(Menu, document.body);
    }
}