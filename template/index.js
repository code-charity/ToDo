document.querySelector('.satus').innerHTML = '';

Menu.main = {
    type: 'main',
    on: {
        render: function(element) {
            let lists = Lists.get(),
                object = Menu.main;

            for (let i = 0, l = lists.length; i < l; i++) {
                if (lists[i]) {
                    object[lists[i].id] = {
                        type: 'folder',
                        innerText: lists[i].name,
                        contextmenu: {
                            remove: {
                                type: 'button',
                                innerText: 'Remove',
                                on: {
                                    click: function() {
                                        delete Menu.main[lists[i].id];
                                        Satus.remove('lists/' + i);
                                        document.querySelector('.satus-contextmenu').remove();
                                        document.querySelector('.satus').innerHTML = '';
                                        Satus.render(document.querySelector('.satus'), Menu);
                                    }
                                }
                            }
                        }
                    };

                    if (lists[i].items.length > 0)
                        for (let j = 0, k = lists[i].items.length; j < k; j++)
                            if (lists[i].items[j])
                                object[lists[i].id][lists[i].items[j].id] = {
                                    type: 'checkbox',
                                    storage: 'lists/' + i + '/items/' + j + '/value',
                                    label: lists[i].items[j].name,
                                    contextmenu: {
                                        remove: {
                                            type: 'button',
                                            innerText: 'Remove',
                                            on: {
                                                click: function() {
                                                    delete Menu.main[lists[i].id][lists[i].items[j].id];
                                                    Satus.remove('lists/' + i + '/items/' + j);
                                                    document.querySelector('.satus-contextmenu').remove();
                                                    document.querySelector('.satus-main__container').innerHTML = '';
                                                    Satus.render(document.querySelector('.satus-main__container'), Menu.main[lists[i].id]);
                                                }
                                            }
                                        }
                                    }
                                };

                    object[lists[i].id];

                    addTaskButton(object[lists[i].id], lists[i].id);
                }
            }

            object.add_list = {
                type: 'input',
                class: ['satus-input--add'],
                placeholder: 'Add list',
                on: {
                    keydown: function(event) {
                        let self = this;

                        if (event.keyCode === 13) {
                            setTimeout(function() {
                                let path = (self.parentNode.path || 'main').split('/').filter(function(value) {
                                        return value != '';
                                    }),
                                    object = Menu;

                                Lists.set(self.value);

                                for (let i = 0, l = path.length; i < l; i++) {
                                    object = object[path[i]];
                                }

                                let button = {};

                                Object.assign(button, object.add_list);

                                delete object.add_list;

                                object.add_list = {};

                                Object.assign(object.add_list, button);

                                let container = self.parentNode;

                                self.parentNode.innerHTML = '';

                                Satus.render(container, object);
                            });
                        }
                    }
                }
            };

            element.querySelector('.satus-main__container:last-child').innerHTML = '';

            Satus.render(element.querySelector('.satus-main__container:last-child'), object);
        }
    }
};

Satus.storage.sync(function() {
    Satus.render(document.querySelector('.satus'), Menu);
});