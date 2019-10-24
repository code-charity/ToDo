const Menu = {
    header: {
        type: 'header',

        section_start: {
            type: 'section',
            class: ['satus-section--align-start'],

            back: {
                type: 'button',
                class: ['satus-button--back'],
                innerHTML: '<svg xmlns=//www.w3.org/2000/svg viewBox="0 0 24 24" style=width:20px;height:20px><path d="M16.6 3c-.5-.5-1.3-.5-1.8 0l-8.3 8.3a1 1 0 0 0 0 1.4l8.3 8.3a1.2 1.2 0 1 0 1.8-1.7L9.4 12l7.2-7.3c.5-.4.5-1.2 0-1.7z"></path></svg>',
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
                innerHTML: '<svg xmlns=//www.w3.org/2000/svg viewBox="0 0 24 24"><path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l4.3 4.3a1 1 0 0 0 1.4-1.5L15.5 14zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"></path></svg>'
            },
            menu: {
                type: 'button',
                innerHTML: '<svg xmlns=//www.w3.org/2000/svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>'
            }
        }
    }
};