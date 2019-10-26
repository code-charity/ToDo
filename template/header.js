const Menu = {
    header: {
        type: 'header',

        section_start: {
            type: 'section',
            class: ['satus-section--align-start'],

            back: {
                type: 'button',
                class: ['satus-button--back'],
                icon: '<svg xmlns=//www.w3.org/2000/svg viewBox="0 0 24 24" style=width:20px;height:20px><path d="M16.6 3c-.5-.5-1.3-.5-1.8 0l-8.3 8.3a1 1 0 0 0 0 1.4l8.3 8.3a1.2 1.2 0 1 0 1.8-1.7L9.4 12l7.2-7.3c.5-.4.5-1.2 0-1.7z"></path></svg>',
                on: {
                    click: function() {
                        document.querySelector('.satus-main__container').close();
                    }
                }
            },
            title: {
                type: 'text',
                class: ['satus-header__title'],
                innerText: 'To-Do'
            }
        },
        section_end: {
            type: 'section',
            class: ['satus-section--align-end'],

            search: {
                type: 'button',
                icon: '<svg xmlns=//www.w3.org/2000/svg viewBox="0 0 24 24"><path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l4.3 4.3a1 1 0 0 0 1.4-1.5L15.5 14zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"></path></svg>',
                on: {
                    click: function() {
                        let offset = this.offsetLeft - this.offsetWidth / 2;

                        Satus.dialog({
                            options: {
                                surface_styles: {
                                    'display': 'flex',
                                    'flex-direction': 'row',
                                    'align-items': 'center',
                                    'position': 'absolute',
                                    'left': '0',
                                    'top': '0',
                                    'max-width': '100%',
                                    'min-width': '0px',
                                    'height': '56px',
                                    'padding': '8px',
                                    'box-sizing': 'border-box',
                                    'box-shadow': 'unset',
                                    'transform-origin': offset + 'px 28px',
                                    'z-index': '1'
                                }
                            },

                            input: {
                                type: 'input',
                                placeholder: 'search',
                                on: {
                                    render: function(element, object) {
                                        setTimeout(function() {
                                            let backspace = 0,
                                                list = {};

                                            element.addEventListener('keydown', function() {
                                                setTimeout(function() {
                                                    if (element.value.length === 0) {
                                                        backspace++;

                                                        if (backspace == 2) {
                                                            this.parentNode.parentNode.querySelector('.satus-dialog__scrim').click();
                                                        }
                                                    }
                                                }, 50);
                                            });

                                            element.addEventListener('input', function() {
                                                list = {};

                                                if (document.querySelector('#search-results')) {
                                                    document.querySelector('#search-results').remove();
                                                }

                                                if (element.value.length >= 1) {
                                                    backspace = 0;

                                                    setTimeout(function() {
                                                        function search(string, object) {
                                                            let result = [];

                                                            for (let i in object) {
                                                                if (object[i].type) {
                                                                    if (/(checkbox)/.test(object[i].type)) {
                                                                        if ((object[i].label || '').toLowerCase().indexOf(string.toLowerCase()) !== -1 || (object[i].innerText || '').toLowerCase().indexOf(string.toLowerCase()) !== -1) {
                                                                            if (object[i].type.indexOf('button') === -1 || !object[i].label) {
                                                                                list[i] = object[i];
                                                                            }
                                                                        }
                                                                    } else {
                                                                        let response = search(string, object[i]);

                                                                        if (/(folder)/.test(object[i].type)) {
                                                                            if ((object[i].label || '').toLowerCase().indexOf(string.toLowerCase()) !== -1 || (object[i].innerText || '').toLowerCase().indexOf(string.toLowerCase()) !== -1) {
                                                                                if (object[i].type.indexOf('button') === -1 || !object[i].label) {
                                                                                    list[i] = object[i];
                                                                                }
                                                                            }
                                                                        }

                                                                        if (response.length > 0) {
                                                                            for (let j = 0, l = response.length; j < l; j++) {
                                                                                result.push(response[i]);
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }

                                                            return result;
                                                        }

                                                        search(element.value, Menu.main);

                                                        let results = document.createElement('div');

                                                        results.id = 'search-results';

                                                        Satus.render(results, list);

                                                        element.parentNode.parentNode.appendChild(results);
                                                    });
                                                }
                                            });

                                            element.focus();
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            },
            menu: {
                type: 'button',
                icon: '<svg xmlns=//www.w3.org/2000/svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>',
                on: {
                    click: function() {
                        Satus.dialog({
                            type: 'dialog',
                            options: {
                                surface_styles: {
                                    'position': 'absolute',
                                    'right': '8px',
                                    'top': '4px',
                                    'max-width': '200px',
                                    'min-width': '0px'
                                }
                            },

                            export: {
                                type: 'button',
                                label: 'Export',
                                icon: '<svg xmlns=//www.w3.org/2000/svg viewBox="0 0 24 24" style=width:16px;height:16px;margin-right:10px;margin-top:2px><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
                                on: {
                                    click: function() {
                                        chrome.runtime.sendMessage({
                                            name: 'download',
                                            filename: 'to-do',
                                            value: Satus.get('')
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    }
};