/*---------------------------------------------------------------
>>> FUNCTIONS
-----------------------------------------------------------------
# Create
# Remove
# Rename
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

    satus.storage.data.data = JSON.stringify(data);
    
    if (satus.storage.get('encrypted') === true) {
        (async function() {
            chrome.storage.local.set({
                data: await satus.aes.encrypt(satus.storage.get('data'), password)
            });
        })();
    } else {
        satus.storage.set('data', satus.storage.get('data'));
    }

    satus.render(render(index), container);

    document.querySelector('.satus-dialog').close();
}


/*---------------------------------------------------------------
# REMOVE
---------------------------------------------------------------*/

function remove() {
    var main = document.querySelector('.satus-main'),
        history_item = main.history[main.history.length - 1],
        data = JSON.parse(satus.storage.get('data'));

    if (main.history.length > 1) {
        var key = this.dataset.key;

        data.lists[history_item.storage_key].items.splice(key, 1);

        satus.storage.data.data = JSON.stringify(data);
    
        if (satus.storage.get('encrypted') === true) {
            (async function() {
                chrome.storage.local.set({
                    data: await satus.aes.encrypt(satus.storage.get('data'), password)
                });
            })();
        }

        update();
    } else {
        data.lists.splice(this.dataset.key, 1);

        satus.storage.data.data = JSON.stringify(data);
    
        if (satus.storage.get('encrypted') === true) {
            (async function() {
                chrome.storage.local.set({
                    data: await satus.aes.encrypt(satus.storage.get('data'), password)
                });
            })();
        } else {
            satus.storage.set('data', satus.storage.get('data'));
        }

        update();
    }
}

/*---------------------------------------------------------------
# RENAME
---------------------------------------------------------------*/

function rename(name, key) {
    var main = document.querySelector('.satus-main'),
        history_item = main.history[main.history.length - 1],
        data = JSON.parse(satus.storage.get('data'));

    if (main.history.length > 1) {
        data.lists[history_item.storage_key].items[key].name = name;
    } else {
        data.lists[key].name = name;
    }
    
    satus.storage.data.data = JSON.stringify(data);
    
    if (satus.storage.get('encrypted') === true) {
        (async function() {
            chrome.storage.local.set({
                data: await satus.aes.encrypt(satus.storage.get('data'), password)
            });
        })();
    } else {
        satus.storage.set('data', satus.storage.get('data'));
    }

    update();
}


/*---------------------------------------------------------------
# UPDATE
---------------------------------------------------------------*/

function update(container) {
    var self = (this === window ? document.querySelector('.satus-main') : this),
        item = self.history[self.history.length - 1],
        id = item.appearanceKey,
        data = JSON.parse(satus.storage.get('data') || '{}'),
        index = -1;

    if (!satus.isset(container)) {
        container = document.querySelector('.satus-main__container');
    }

    document.body.dataset.appearance = id;
    container.dataset.appearance = id;

    document.querySelector('.satus-text--title').innerText = satus.locale.getMessage(item.label) || satus.locale.getMessage('lists');

    container.querySelector('.satus-scrollbar__content').innerHTML = '';

    if (item.appearanceKey === 'home') {
        if (Object.keys(data).length === 0) {
            satus.storage.set('data', JSON.stringify({
                lists: [{
                    name: satus.locale.getMessage('myTasks'),
                    items: []
                }]
            }));
        }
    } else if (item.appearanceKey === 'list') {
        index = item.storage_key;
    }

    satus.render(render(index), container.querySelector('.satus-scrollbar__content'));
}


/*---------------------------------------------------------------
# RENDER
---------------------------------------------------------------*/

function render(index) {
    var object = JSON.parse(satus.storage.get('data')).lists;

    if (index === -1) {
        if (object.length === 0) {
            var container = {
                type: 'section',
                class: 'satus-section--main',

                text: {
                    type: 'text',
                    class: 'satus-text--message',
                    label: 'noLists'
                }
            };
        } else {
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
                    actions: {
                        type: 'button',
                        class: 'satus-button--menu',
                        before: '<svg stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="12" cy="5.25" r="0.45"/><circle cx="12" cy="12" r="0.45"/><circle cx="12" cy="18.75" r="0.45"/></svg>',
                        onclick: {
                            type: 'dialog',
                            class: 'satus-dialog--menu',
                            style: {
                                
                            },
                            
                            button_rename: {
                                type: 'button',
                                label: 'rename',
                                dataset: {
                                    key: i
                                },
                                onclick: function() {
                                    satus.render({
                                        type: 'dialog',
                                        class: 'satus-dialog--create',

                                        label: {
                                            type: 'text',
                                            label: 'name'
                                        },
                                        text_field: {
                                            type: 'text-field',
                                            class: 'satus-text-field--value',
                                            dataset: {
                                                key: this.dataset.key
                                            },
                                            onkeydown: function(event) {
                                                if (event.keyCode === 13) {
                                                    rename(this.value, this.dataset.key);
                                                    
                                                    document.querySelector('.satus-dialog').close();
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
                                                label: 'rename',
                                                dataset: {
                                                    key: this.dataset.key
                                                },
                                                onclick: function() {
                                                    rename(document.querySelector('.satus-text-field--value').value, this.dataset.key);
                                                    
                                                    document.querySelector('.satus-dialog').close();
                                                }
                                            }
                                        }
                                    });
                                    
                                    document.querySelector('.satus-dialog').close();
                                }
                            },
                            button_remove: {
                                type: 'button',
                                label: 'remove',
                                dataset: {
                                    key: i
                                },
                                onclick: function() {
                                    this.r = remove;
                                    
                                    this.r();
                                    
                                    document.querySelector('.satus-dialog').close();
                                }
                            }
                        }
                    }
                };
            }
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

                            satus.storage.data.data = JSON.stringify(data);
    
                            if (satus.storage.get('encrypted') === true) {
                                (async function() {
                                    chrome.storage.local.set({
                                        data: await satus.aes.encrypt(satus.storage.get('data'), password)
                                    });
                                })();
                            }
                        }
                    },
                    actions: {
                        type: 'button',
                        class: 'satus-button--menu',
                        before: '<svg stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="12" cy="5.25" r="0.45"/><circle cx="12" cy="12" r="0.45"/><circle cx="12" cy="18.75" r="0.45"/></svg>',
                        onclick: {
                            type: 'dialog',
                            class: 'satus-dialog--menu',
                            style: {
                                
                            },
                            
                            button_rename: {
                                type: 'button',
                                label: 'rename',
                                dataset: {
                                    key: i
                                },
                                onclick: function() {
                                    satus.render({
                                        type: 'dialog',
                                        class: 'satus-dialog--create',

                                        label: {
                                            type: 'text',
                                            label: 'name'
                                        },
                                        text_field: {
                                            type: 'text-field',
                                            class: 'satus-text-field--value',
                                            dataset: {
                                                key: this.dataset.key
                                            },
                                            onkeydown: function(event) {
                                                if (event.keyCode === 13) {
                                                    rename(this.value, this.dataset.key);
                                                    
                                                    document.querySelector('.satus-dialog').close();
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
                                                label: 'rename',
                                                dataset: {
                                                    key: this.dataset.key
                                                },
                                                onclick: function() {
                                                    rename(document.querySelector('.satus-text-field--value').value, this.dataset.key);
                                                    
                                                    document.querySelector('.satus-dialog').close();
                                                }
                                            }
                                        }
                                    });
                                    
                                    document.querySelector('.satus-dialog').close();
                                }
                            },
                            button_remove: {
                                type: 'button',
                                label: 'remove',
                                dataset: {
                                    key: i
                                },
                                onclick: function() {
                                    this.r = remove;
                                    
                                    this.r();
                                    
                                    document.querySelector('.satus-dialog').close();
                                }
                            }
                        }
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
        data = JSON.parse(satus.storage.get('data')),
        old_index2 = Number(document.querySelectorAll('.satus-main .satus-list li')[old_index].querySelector('button').dataset.key),
        new_index2 = Number(document.querySelectorAll('.satus-main .satus-list li')[new_index].querySelector('button').dataset.key);

    if (main.history.length > 1) {
        var index = main.history[main.history.length - 1].storage_key;

        data.lists[index].items.splice(new_index2, 0, data.lists[index].items.splice(old_index2, 1)[0]);
    } else {
        data.lists.splice(new_index2, 0, data.lists.splice(old_index2, 1)[0]);
    }

    document.querySelectorAll('.satus-main .satus-list li')[old_index].querySelector('button').dataset.key = new_index2;
    document.querySelectorAll('.satus-main .satus-list li')[new_index].querySelector('button').dataset.key = old_index2;

    satus.storage.data.data = JSON.stringify(data);
    
    if (satus.storage.get('encrypted') === true) {
        (async function() {
            chrome.storage.local.set({
                data: await satus.aes.encrypt(satus.storage.get('data'), password)
            });
        })();
    } else {
        satus.storage.set('data', satus.storage.get('data'));
    }
}

function importData() {
    satus.render({
        type: 'dialog',
        
        select_file: {
            type: 'button',
            label: 'selectFile',
            onclick: function() {
                var input = document.createElement('input');

                input.type = 'file';

                input.addEventListener('change', function() {
                    var file_reader = new FileReader();

                    file_reader.onload = function() {
                        var data = JSON.parse(this.result);
                        
                        for (var key in data) {
                            satus.storage.set(key, data[key]);
                        }
                        
                        if (location.href.indexOf('action=import') !== -1) {
                            window.close();
                        } else {
                            document.querySelector('.satus-dialog__scrim').click();
                            
                            satus.render({
                                type: 'dialog',

                                message: {
                                    type: 'text',
                                    label: 'dataImportedSuccessfully'
                                },
                                section: {
                                    type: 'section',
                                    class: 'controls',

                                    ok: {
                                        type: 'button',
                                        label: 'ok',
                                        onclick: function() {
                                            document.querySelector('.satus-dialog__scrim').click();
                                        }
                                    }
                                }
                            });
                        }
                    };

                    file_reader.readAsText(this.files[0]);
                });

                input.click();
            }
        }
    });
}

function exportData() {
    var blob = new Blob([JSON.stringify(satus.storage.data)], {
        type: 'application/json;charset=utf-8'
    });
    
    satus.render({
        type: 'dialog',

        export: {
            type: 'button',
            label: 'export',
            onclick: function() {
                chrome.permissions.request({
                    permissions: ['downloads']
                }, function(granted) {
                    if (granted) {
                        chrome.downloads.download({
                            url: URL.createObjectURL(blob),
                            filename: 'todo.json',
                            saveAs: true
                        }, function() {
                            setTimeout(function() {
                                if (location.href.indexOf('action=export') !== -1) {
                                    window.close();
                                } else {
                                    document.querySelector('.satus-dialog__scrim').click();
                                    
                                    satus.render({
                                        type: 'dialog',

                                        message: {
                                            type: 'text',
                                            label: 'dataExportedSuccessfully'
                                        },
                                        section: {
                                            type: 'section',
                                            class: 'controls',

                                            ok: {
                                                type: 'button',
                                                label: 'ok',
                                                onclick: function() {
                                                    document.querySelector('.satus-dialog__scrim').click();
                                                }
                                            }
                                        }
                                    });
                                }
                            }, 100);
                        });
                    }
                });
            }
        }
    });
}
