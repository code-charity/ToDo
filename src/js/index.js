/*---------------------------------------------------------------
>>> INDEX
---------------------------------------------------------------*/

var password = '';

satus.storage.import(function() {
    satus.locale.import(satus.storage.get('language'), function() {
        satus.modules.updateStorageKeys(Menu, function() {
            if (location.href.indexOf('action=import') !== -1) {
                importData();
            } else if (location.href.indexOf('action=export') !== -1) {
                exportData();
            } else {
                var encrypted = satus.storage.get('encrypted');
    
                if (encrypted) {
                    satus.render({
                        type: 'dialog',
                        class: 'satus-dialog--encryption',
                        clickclose: false,
                        
                        title: {
                            type: 'text',
                            label: 'password'
                        },
                        text_field: {
                            type: 'text-field',
                            id: 'password',
                            onrender: function() {
                                var self = this;
                                
                                setTimeout(function() {
                                    self.focus();
                                });
                            },
                            onkeypress: async function(event) {
                                if (event.keyCode === 13) {
                                    var data = await satus.aes.decrypt(satus.storage.get('data'), document.querySelector('#password').value);
                                
                                    if (data) {
                                        satus.storage.data.data = data;
                                        
                                        password = document.querySelector('#password').value;
                                        
                                        satus.render(Menu);
                                    
                                        document.querySelector('.satus-dialog').close();
                                    } else {
                                        document.querySelector('#password').classList.add('error');
                                        
                                        document.querySelector('#password').focus();
                                    }
                                }
                            }
                        },
                        section: {
                            type: 'section',
                            
                            button: {
                                type: 'button',
                                label: 'ok',
                                
                                onclick: async function() {
                                    var data = await satus.aes.decrypt(satus.storage.get('data'), document.querySelector('#password').value);
                                    
                                    if (data) {
                                        satus.storage.data.data = data;
                                        
                                        password = document.querySelector('#password').value;
                                        
                                        satus.render(Menu);
                                    
                                        document.querySelector('.satus-dialog').close();
                                    } else {
                                        document.querySelector('#password').classList.add('error');
                                        
                                        document.querySelector('#password').focus();
                                    }
                                }
                            }
                        }
                    });
                } else {
                    satus.render(Menu);
                }
            }
        });
    });
});
