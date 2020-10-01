
/*---------------------------------------------------------------
>>> FUNCTIONS
-----------------------------------------------------------------
# Create
# Remove
# Update
# Render
# Other
---------------------------------------------------------------*/

/*---------------------------------------------------------------
# CREATE
---------------------------------------------------------------*/

function create() {
    var main = document.querySelector('.satus-main'),
        history_item = main.history[main.history.length - 1],
        data = JSON.parse(satus.storage.get('data')),
        value = document.querySelector('.satus-text-field--value').value,
        container = document.querySelector('.satus-main .satus-scrollbar__content'),
        index = -1;

    container.innerHTML = '';

    if (history_item.appearanceKey === 'home') {
        data.lists.push({
            name: value,
            items: []
        });
    } else {
        data.lists[history_item.storage_key].items.push({
            name: value,
            value: false
        });
        
        index = history_item.storage_key;
    }
    
    satus.storage.set('data', JSON.stringify(data));

    Satus.render(render(index), container);

    document.querySelector('.satus-dialog__scrim').click();
}


/*---------------------------------------------------------------
# REMOVE
---------------------------------------------------------------*/

function remove() {
    var main = document.querySelector('.satus-main'),
        history_item = main.history[main.history.length - 1],
        data = JSON.parse(satus.storage.get('data'));

    if (main.history.length > 1) {
        var key = this.parentNode.querySelector('.satus-switch').dataset.key;

        data.lists[history_item.storage_key].items.splice(key, 1);
        
        satus.storage.set('data', JSON.stringify(data));

        update();
    } else {
        data.lists.splice(this.parentNode.querySelector('.satus-folder').dataset.key, 1);

        satus.storage.set('data', JSON.stringify(data));

        update();
    }
}


/*---------------------------------------------------------------
# UPDATE
---------------------------------------------------------------*/

function update(container) {
    var self = (this === window ? document.querySelector('.satus-main') : this),
        item = self.history[self.history.length - 1],
        id = item.appearanceKey,
        data = JSON.parse(Satus.storage.get('data') || '{}'),
        index = -1;

    if (!Satus.isset(container)) {
        container = document.querySelector('.satus-main__container');
    }

    document.body.dataset.appearance = id;
    container.dataset.appearance = id;

    document.querySelector('.satus-text--title').innerText = Satus.locale.getMessage(item.label) || 'Lists';

    container.querySelector('.satus-scrollbar__content').innerHTML = '';

    if (item.appearanceKey === 'home') {
        if (Object.keys(data).length === 0) {
            satus.storage.set('data', JSON.stringify({
                lists: [
                    {
                        name: 'myTasks',
                        items: []
                    }
                ]
            }));
        }
    } else if (item.appearanceKey === 'list') {
        index = item.storage_key;
    }
    
    Satus.render(render(index), container.querySelector('.satus-scrollbar__content'));
}


/*---------------------------------------------------------------
# RENDER
---------------------------------------------------------------*/

function render(index) {
    var object = JSON.parse(satus.storage.get('data')).lists;

    if (index === -1) {
        var container = {
            type: 'list',
            compact: true,
            sortable: true,
            onchange: change
        };

        for (var i = 0, l = object.length; i < l; i++) {
            container[i] = {
                type: 'section',

                folder: {
                    type: 'folder',
                    label: object[i].name,
                    before: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
                    appearanceKey: 'list',
                    storage_key: String(i),
                    dataset: {
                        key: i
                    }
                },

                button: {
                    type: 'button',
                    class: 'satus-button--remove',
                    before: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
                    onclick: remove
                }
            };
        }
    } else {
        object = object[index];

        if (object.items.length === 0) {
            var container = {
                type: 'section',
                class: 'satus-section--main',
                
                text: {
                    type: 'text',
                    class: 'satus-text--message',
                    label: 'noTasks'
                }
            };
        } else {
            var container = {
                type: 'list',
                compact: true,
                sortable: true,
                onchange: change
            };

            for (var i = 0, l = object.items.length; i < l; i++) {
                container[i] = {
                    type: 'section',
                    
                    checkbox: {
                        type: 'switch',
                        class: 'satus-switch--checkbox',
                        label: object.items[i].name,
                        value: object.items[i].value,
                        storage_key: String(i),
                        dataset: {
                            key: i
                        },
                        onchange: function() {
                            var main = document.querySelector('.satus-main'),
                                history_item = main.history[main.history.length - 1],
                                data = JSON.parse(satus.storage.get('data'));

                            data.lists[history_item.storage_key].items[this.dataset.key].value = this.querySelector('input').checked;
                            
                            satus.storage.set('data', JSON.stringify(data));
                        }
                    },
                    remove: {
                        type: 'button',
                        class: 'satus-button--remove',
                        before: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
                        onclick: remove
                    }
                };
            }
        }
    }
    
    return container;
}


/*---------------------------------------------------------------
# OTHER
---------------------------------------------------------------*/

function change(old_index, new_index) {
    var main = document.querySelector('.satus-main'),
        data = JSON.parse(Satus.storage.get('data')),
        old_index2 = Number(document.querySelectorAll('.satus-main .satus-list li')[old_index].querySelector('button').dataset.key),
        new_index2 = Number(document.querySelectorAll('.satus-main .satus-list li')[new_index].querySelector('button').dataset.key);

    console.log(old_index, new_index);    
    
    if (main.history.length > 1) {
        var index = main.history[main.history.length - 1].storage_key;
        
        data.lists[index].items.splice(new_index2, 0, data.lists[index].items.splice(old_index2, 1)[0]);
    } else {
        data.lists.splice(new_index2, 0, data.lists.splice(old_index2, 1)[0]);
    }
    
    document.querySelectorAll('.satus-main .satus-list li')[old_index].querySelector('button').dataset.key = new_index2;
    document.querySelectorAll('.satus-main .satus-list li')[new_index].querySelector('button').dataset.key = old_index2;

    satus.storage.set('data', JSON.stringify(data));
}

/*---------------------------------------------------------------
>>> HEADER
---------------------------------------------------------------*/

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
                    document.querySelector('.satus-main').back();
                }
            },
            title: {
                type: 'text',
                class: 'satus-text--title'
            }
        },
        section_end: {
            type: 'section',
            class: 'satus-section--align-end',

            button_vert: {
                type: 'button',
                before: '<svg stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="12" cy="5.25" r="0.45"/><circle cx="12" cy="12" r="0.45"/><circle cx="12" cy="18.75" r="0.45"/></svg>',
                onclick: {
                    type: 'dialog',
                    class: 'satus-dialog--vertical-menu',

                    export: {
                        type: 'button',
                        label: 'export',
                        before: '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>',
                        onclick: function() {
                            chrome.runtime.sendMessage({
                                name: 'download',
                                filename: 'todo.json',
                                value: satus.storage.get('data')
                            });
                        }
                    },
                    import: {
                        type: 'button',
                        label: 'import',
                        before: '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
                        onclick: function() {
                            try {
                                var input = document.createElement('input');

                                input.type = 'file';

                                input.addEventListener('change', function() {
                                    var file_reader = new FileReader();

                                    file_reader.onload = function() {
                                        var data = JSON.parse(this.result);

                                        for (var i in data) {
                                            satus.storage.set(i, data[i]);
                                        }

                                        satus.render({
                                            type: 'dialog',

                                            message: {
                                                type: 'text',
                                                label: 'successfullyImportedSettings'
                                            },
                                            section: {
                                                type: 'section',
                                                class: 'controls',

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
                                                    label: 'ok',
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
                            } catch (err) {}
                        }
                    }
                }
            }
        }
    }
};

/*---------------------------------------------------------------
>>> MAIN
---------------------------------------------------------------*/

Menu.main = {
    type: 'main',
    appearanceKey: 'home',
    on: {
        change: update
    }
};

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

/*---------------------------------------------------------------
>>> FOOTER
---------------------------------------------------------------*/

Menu.create = {
    type: 'button',
    before: '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    class: 'satus-button--create',
    onclick: {
        type: 'dialog',
        class: 'satus-dialog--create',

        label: {
            type: 'text',
            label: 'name'
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
                label: 'create',
                onclick: create
            }
        }
    }
};
