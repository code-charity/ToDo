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
                        before: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>',
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
                        before: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
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
