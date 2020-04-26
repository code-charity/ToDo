
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

function update(container) {
    var item = this.history[this.history.length - 1],
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
                    type: 'folder',
                    label: 'My Tasks',
                    before: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
                    appearanceKey: 'list',
                    storage_key: 0
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
                ui.list[key] = data[key];
                ui.list[key].appearanceKey = 'list';
                ui.list[key].storage_key = key;
                ui.list[key].dataset = {
                    key: key
                };
                ui.list[key].before = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>';
            }
        }
    } else if (item.appearanceKey === 'list') {
        if (Object.keys(item).length === 5) {
            ui.list.class = 'satus-list--message';

            ui.list.message = {
                type: 'text',
                innerText: 'No tasks'
            };
        } else {
            for (var key in data[item.storage_key]) {
                if (typeof data[item.storage_key][key] === 'object') {
                    ui.list[key] = data[item.storage_key][key];
                    ui.list[key].class = 'satus-switch--checkbox';
                    ui.list[key].dataset = {
                        key: key
                    };
                    ui.list[key].onchange = function() {
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

    Satus.render(ui, container.querySelector('.satus-scrollbar__content'));
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
        data[key].before = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>';

        Satus.render(data[key], document.querySelector('.satus-main .satus-list'));
    } else {
        var folder_key = history_item.storage_key,
            task_key = Object.keys(data[folder_key]).length;

        data[folder_key][task_key] = {
            type: 'switch',
            class: 'satus-switch--checkbox',
            label: value
        };

        Satus.storage.set('data', JSON.stringify(data));

        data[folder_key][task_key].storage_key = task_key;

        if (document.querySelector('.satus-main .satus-list--message .satus-text')) {
            document.querySelector('.satus-main .satus-list--message .satus-text').remove();
        }

        Satus.render(data[folder_key][task_key], document.querySelector('.satus-main .satus-list'));
    }

    document.querySelector('.satus-dialog__scrim').click();
}
var Menu = {
    header: {
        type: 'header',

        section_start: {
            type: 'section',
            class: 'satus-section--align-start',

            button_back: {
                type: 'button',
                class: 'satus-button--back',
                before: '<svg stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M14 18l-6-6 6-6"/></svg>',
                onclick: function() {
                    if (document.querySelector('.satus-dialog__scrim')) {
                        document.querySelector('.satus-dialog__scrim').click();
                    } else {
                        document.querySelector('.satus-main').back();
                    }
                }
            },
            title: {
                type: 'text',
                class: 'satus-text--title',
                innerText: ''
            }
        },
        section_end: {
            type: 'section',
            class: 'satus-section--align-end',

            button_vert: {
                type: 'button',
                icon: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5.25" r="0.45"/><circle cx="12" cy="12" r="0.45"/><circle cx="12" cy="18.75" r="0.45"/></svg>',
                onClickRender: {
                    type: 'dialog',
                    class: 'satus-dialog--vertical-menu',

                    export: {
                        type: 'button',
                        label: 'Export',
                        onclick: function() {
                            chrome.runtime.sendMessage({
                                name: 'download',
                                filename: 'todo.json',
                                value: Satus.storage.get('data')
                            });
                        }
                    },
                    import: {
                        type: 'button',
                        label: 'Import',
                        onclick: function() {
                            try {
                                var input = document.createElement('input');

                                input.type = 'file';

                                input.addEventListener('change', function() {
                                    var file_reader = new FileReader();

                                    file_reader.onload = function() {
                                        var data = JSON.parse(this.result);

                                        for (var i in data) {
                                            Satus.storage.set(i, data[i]);
                                        }

                                        Satus.render({
                                            type: 'dialog',

                                            message: {
                                                type: 'text',
                                                label: 'successfullyImportedSettings',
                                                style: {
                                                    'width': '100%',
                                                    'opacity': '.8'
                                                }
                                            },
                                            section: {
                                                type: 'section',
                                                class: 'controls',
                                                style: {
                                                    'justify-content': 'flex-end',
                                                    'display': 'flex'
                                                },

                                                cancel: {
                                                    type: 'button',
                                                    label: 'cancel',
                                                    onclick: function() {
                                                        var scrim = document.querySelectorAll('.satus-dialog__scrim');

                                                        scrim[scrim.length - 1].click();
                                                    }
                                                },
                                                ok: {
                                                    type: 'button',
                                                    label: 'OK',
                                                    onclick: function() {
                                                        var scrim = document.querySelectorAll('.satus-dialog__scrim');

                                                        scrim[scrim.length - 1].click();
                                                    }
                                                }
                                            }
                                        });
                                    };

                                    file_reader.readAsText(this.files[0]);
                                });

                                input.click();
                            } catch (err) {
                                chrome.runtime.sendMessage({
                                    name: 'dialog-error',
                                    value: err
                                });
                            }
                        }
                    }
                }
            }
        }
    }
};
Menu.main = {
    type: 'main',
    appearanceKey: 'home',
    on: {
        change: update
    }
};
Satus.storage.import(function() {
    Satus.modules.updateStorageKeys(Menu, function() {
        Satus.render(Menu, document.body);
    });
});
Menu.create = {
    type: 'button',
    before: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    class: 'satus-button--create',
    onClickRender: {
        type: 'dialog',
        class: 'satus-dialog--create',

        label: {
            type: 'text',
            label: 'Name'
        },
        text_field: {
            type: 'text-field',
            class: 'satus-text-field--value',
            onkeydown: function(event) {
                if (event.keyCode === 13) {
                    create();
                }
            },
            onrender: function() {
                var self = this;

                setTimeout(function() {
                    self.focus();
                });
            }
        },
        section: {
            type: 'section',

            button: {
                type: 'button',
                label: 'Create',
                onclick: create
            }
        }
    }
};