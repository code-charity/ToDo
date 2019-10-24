document.querySelector('.satus').innerHTML = '';

Menu.main = {
    type: 'main',
    on: {
        render: function(element) {
            let lists = Lists.get(),
                object = Menu.main;

            for (let i = 0, l = lists.length; i < l; i++) {
                object[lists[i].id] = {
                    type: 'folder',
                    innerText: lists[i].name
                };

                if (lists[i].items.length > 0)
                    for (let j = 0, k = lists[i].items.length; j < k; j++)
                        object[lists[i].id][lists[i].items[j].id] = {
                            type: 'switch',
                            label: lists[i].items[j].name
                        };

                object[lists[i].id];
                
                addTaskButton(object[lists[i].id], lists[i].id);
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

Satus.render(document.querySelector('.satus'), Menu);