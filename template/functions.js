function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);

        return v.toString(16);
    });
}

function addTaskButton(object, id) {
    object.add_task = {
        type: 'input',
        class: ['satus-input--add'],
        placeholder: 'Add task',
        list_id: id,
        on: {
            keydown: function(event) {
                let self = this;

                if (event.keyCode === 13) {
                    setTimeout(function() {
                        let path = self.parentNode.path.split('/').filter(function(value) {
                                return value != '';
                            }),
                            object = Menu;

                        Tasks.set(self.list_id, self.value);

                        for (let i = 0, l = path.length; i < l; i++) {
                            object = object[path[i]];
                        }

                        let button = {};

                        Object.assign(button, object.add_task);

                        delete object.add_task;

                        object.add_task = {};

                        Object.assign(object.add_task, button);

                        let container = self.parentNode;

                        self.parentNode.innerHTML = '';

                        Satus.render(container, object);
                    });
                }
            }
        }
    };
}

const Lists = {
    get: function() {
        let lists = Satus.get('lists') || [];

        if (lists.length === 0)
            lists.push({
                id: uuidv4(),
                name: 'Tasks',
                items: []
            });

        Satus.set('lists', lists);

        return lists;
    },
    set: function(name) {
        let lists = Lists.get(),
            id = uuidv4();

        lists.push({
            id: id,
            name: name,
            items: []
        });

        Menu.main[id] = {
            type: 'folder',
            innerText: name
        };

        addTaskButton(Menu.main[id], id);

        Satus.set('lists', lists);
    }
};

const Tasks = {
    set: function(id, name) {
        let lists = Lists.get(),
            item_id = uuidv4();

        for (let i = 0, l = lists.length; i < l; i++) {
            if (lists[i].id === id) {
                lists[i].items.push({
                    id: item_id,
                    name: name
                });

                Menu.main[id][item_id] = {
                    type: 'switch',
                    label: name
                };
            }
        }

        Satus.set('lists', lists);
    }
};