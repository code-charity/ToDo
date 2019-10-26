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
                items: [],
                contextmenu: {
                    rename: {
                        type: 'button',
                        innerText: 'Rename',
                        data: lists[lists.length],
                        data_id: lists.length,
                        on: {
                            click: function() {
                                document.querySelector('.satus-contextmenu').remove();

                                Satus.dialog({
                                    input: {
                                        type: 'input',
                                        data: this.data,
                                        data_id: this.data_id,
                                        value: this.data.name,
                                        on: {
                                            keydown: function(event) {
                                                let self = this;

                                                if (event.keyCode === 13) {
                                                    this.data.name = this.value;
                                                    Menu.main[this.data.id].label = this.value;
                                                    Satus.set('lists/' + this.data_id, this.data);
                                                    document.querySelector('.satus-dialog').remove();
                                                    document.querySelector('.satus').innerHTML = '';
                                                    Satus.render(document.querySelector('.satus'), Menu);
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    },
                    delete: {
                        type: 'button',
                        innerText: 'Delete',
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

        document.querySelector('.satus').innerHTML = '';

        for (let i in Menu.main) {
            if (i !== 'type' && i !== 'on') {
                delete Menu.main[i];
            }
        }

        Satus.render(document.querySelector('.satus'), Menu);

        Satus.set('lists', lists);
    }
};

const Tasks = {
    set: function(id, name) {
        let lists = Lists.get(),
            item_id = uuidv4();

        for (let i = 0, l = lists.length; i < l; i++) {
            if (lists[i] && lists[i].id === id) {
                lists[i].items.push({
                    id: item_id,
                    name: name
                });

                Menu.main[id][item_id] = {
                    type: 'checkbox',
                    storage: 'lists/' + i + '/items/' + (lists[i].items.length - 1) + '/value',
                    label: name,
                    contextmenu: {
                        rename: {
                            type: 'button',
                            innerText: 'Rename',
                            data: lists[i],
                            data_j: lists[i].items[lists[i].items.length - 1],
                            data_id: i,
                            data_id_j: lists[i].items.length,
                            on: {
                                click: function() {
                                    document.querySelector('.satus-contextmenu').remove();

                                    Satus.dialog({
                                        input: {
                                            type: 'input',
                                            data: this.data,
                                            data_j: this.data_j,
                                            data_id: this.data_id,
                                            data_id_j: this.data_id_j,
                                            value: this.data_j.name,
                                            on: {
                                                keydown: function(event) {
                                                    let self = this;

                                                    if (event.keyCode === 13) {
                                                        this.data_j.name = this.value;
                                                        Menu.main[this.data.id][this.data_j.id].label = this.value;
                                                        Satus.set('lists/' + this.data_id + '/items/' + this.data_id_j, this.data_j);
                                                        document.querySelector('.satus-dialog').remove();
                                                        document.querySelector('.satus-main__container').innerHTML = '';
                                                        Satus.render(document.querySelector('.satus-main__container'), Menu.main[this.data.id]);
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        },
                        delete: {
                            type: 'button',
                            innerText: 'Delete',
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
            }
        }

        Satus.set('lists', lists);
    }
};