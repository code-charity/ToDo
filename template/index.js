document.querySelector('.satus').innerHTML = '';

Menu.main = {
    type: 'main',
    on: {
        render: function(element) {
            let lists = Lists.get(),
                object = Menu.main;

            /*-----------------------------------------------------------------
            # Lists
            -----------------------------------------------------------------*/
            for (let i = 0, l = lists.length; i < l; i++) {
                if (lists[i]) {
                    object[lists[i].id] = {
                        type: 'folder',
                        innerText: lists[i].name,
                        contextmenu: {
                            rename: {
                                type: 'button',
                                innerText: 'Rename',
                                data: lists[i],
                                data_id: i,
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
                        },
                        on: {
                            mousedown: function(event) {
                                var self = this,
                                    offset_y = event.clientY,
                                    moved = false;

                                function move(event) {
                                    event.preventDefault();

                                    self.style.transform = 'translateY(' + (event.clientY - offset_y) + 'px)';
                                    self.style.pointerEvents = 'none';

                                    moved = true;

                                    return false;
                                }

                                function up(event) {
                                    if (moved === true) {
                                        let current_index = 0,
                                            new_index = -1;

                                        for (let i = 0, l = self.parentNode.querySelectorAll('.satus-folder').length; i < l; i++) {
                                            if (self === self.parentNode.querySelectorAll('.satus-folder')[i]) {
                                                current_index = i;
                                            }
                                        }

                                        for (let i = 0, l = self.parentNode.querySelectorAll('.satus-folder').length; i < l; i++) {
                                            if (
                                                event.clientY - 56 >
                                                self.parentNode.querySelectorAll('.satus-folder')[i].offsetTop
                                            ) {
                                                new_index++;
                                            }
                                        }

                                        let data = Satus.get('lists').filter(function(item) {
                                            return item != null;
                                        });

                                        let new_data = new Array(data.length);

                                        new_data[current_index] = data[new_index];
                                        data[new_index] = data[current_index];

                                        for (let i = 0, l = data.length; i < l; i++) {
                                            if (new_data[i] === undefined) {
                                                new_data[i] = data[i];
                                            }
                                        }

                                        Satus.set('lists', new_data);

                                        document.querySelector('.satus').innerHTML = '';

                                        for (let i in Menu.main) {
                                            if (i !== 'type' && i !== 'on') {
                                                delete Menu.main[i];
                                            }
                                        }

                                        Satus.render(document.querySelector('.satus'), Menu);
                                    }

                                    self.style.transform = '';
                                    self.style.pointerEvents = '';
                                    window.removeEventListener('mousemove', move);
                                    window.removeEventListener('mouseup', up);
                                }

                                window.addEventListener('mousemove', move);
                                window.addEventListener('mouseup', up);
                            }
                        }
                    };


                    /*---------------------------------------------------------
                    # Items
                    ---------------------------------------------------------*/
                    if (lists[i].items.length > 0)
                        for (let j = 0, k = lists[i].items.length; j < k; j++)
                            if (lists[i].items[j])
                                object[lists[i].id][lists[i].items[j].id] = {
                                    type: 'checkbox',
                                    storage: 'lists/' + i + '/items/' + j + '/value',
                                    label: lists[i].items[j].name,
                                    contextmenu: {
                                        rename: {
                                            type: 'button',
                                            innerText: 'Rename',
                                            data: lists[i],
                                            data_j: lists[i].items[j],
                                            data_id: i,
                                            data_id_j: j,
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