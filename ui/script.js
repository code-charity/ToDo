/*--------------------------------------------------------------
>>> SCRIPT
----------------------------------------------------------------
# Skeleton
# Initialization
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# SKELETON
--------------------------------------------------------------*/

var password,
	lists = [],
	skeleton = {
	component: 'base',

	header: {
		component: 'header',

		section_1: {
			component: 'section',
			variant: 'align-start',

			back: {
				component: 'button',
				attr: {
					'hidden': 'true'
				},
				on: {
					click: 'layers.back'
				},

				svg: {
					component: 'svg',
					attr: {
						'viewBox': '0 0 24 24',
						'fill': 'none',
						'stroke-width': '1.5',
						'stroke': 'currentColor'
					},

					path: {
						component: 'path',
						attr: {
							'd': 'M14 18l-6-6 6-6'
						}
					}
				}
			},
			title: {
				component: 'span',
				variant: 'title'
			}
		},
		section_2: {
			component: 'section',
			variant: 'align-end',

			menu: {
                component: 'button',
                on: {
                    click: {
                        component: 'modal',
                        variant: 'vertical',

                        label: {
                        	component: 'span',
                        	text: 'theme'
                        },
                        theme: {
                        	component: 'tabs',
                        	items: [
                        		'light',
                        		'dark',
                        		'black'
                        	]
                        },
                        divider: {
                        	component: 'divider'
                        },
                        language: {
							component: 'select',
							on: {
								change: function (name, value) {
									var self = this;

									satus.ajax('_locales/' + this.querySelector('select').value + '/messages.json', function (response) {
										response = JSON.parse(response);

										for (var key in response) {
											satus.locale.strings[key] = response[key].message;
										}

										self.base.skeleton.header.section_1.title.rendered.textContent = satus.locale.get('languages');

										self.base.skeleton.layers.rendered.update();
									});
								}
							},
							options: [{
								value: 'en',
								text: 'English'
							}, {
								value: 'ru',
								text: 'Русский'
							}, {
								value: 'de',
								text: 'Deutsch'
							}],

							svg: {
								component: 'svg',
								attr: {
									'viewBox': '0 0 24 24',
									'fill': 'currentColor'
								},

								path: {
									component: 'path',
									attr: {
										'd': 'M12.9 15l-2.6-2.4c1.8-2 3-4.2 3.8-6.6H17V4h-7V2H8v2H1v2h11.2c-.7 2-1.8 3.8-3.2 5.3-1-1-1.7-2.1-2.3-3.3h-2c.7 1.6 1.7 3.2 3 4.6l-5.1 5L4 19l5-5 3.1 3.1.8-2zm5.6-5h-2L12 22h2l1.1-3H20l1.1 3h2l-4.5-12zm-2.6 7l1.6-4.3 1.6 4.3H16z'
									}
								}
							},
							label: {
								component: 'span',
								text: 'language'
							}
						},
						encrypted: {
							component: 'switch',
							storage: false,
							on: {
								change: function () {
									crypt(this.dataset.value === 'true', JSON.stringify(lists), function (mode, data) {
										if (mode) {
			                                satus.storage.set('encrypted', true);
			                            } else {
			        						satus.storage.set('encrypted', false);
			                            }

			                            satus.storage.set('lists', data);
									});
								}
							},

							svg: {
								component: 'svg',
								attr: {
									'viewBox': '0 0 24 24',
									'fill': 'none',
									'stroke': 'currentColor',
									'stroke-linecap': 'round',
									'stroke-linejoin': 'round',
									'stroke-width': '2'
								},

								path: {
									component: 'path',
									attr: {
										'd': 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'
									}
								}
							},
							label: {
								component: 'span',
								text: 'encryption'
							}
						},
						export: {
							component: 'button',
                            on: {
                                click: function () {
                                    if (location.href.indexOf('/options.html?action=export') !== -1) {
                                        exportData();
                                    } else {
                                        chrome.tabs.create({
                                            url: 'ui/options.html?action=export'
                                        });
                                    }
                                }
                            },

							svg: {
								component: 'svg',
								attr: {
									'viewBox': '0 0 24 24',
									'fill': 'none',
									'stroke': 'currentColor',
									'stroke-linecap': 'round',
									'stroke-linejoin': 'round',
									'stroke-width': '2'
								},

								path: {
									component: 'path',
									attr: {
										'd': 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12'
									}
								}
							},
							label: {
								component: 'span',
								text: 'export'
							}
						},
						import: {
							component: 'button',
                            on: {
                                click: function () {
                                    if (location.href.indexOf('/options.html?action=import') !== -1) {
                                        importData();
                                    } else {
                                        chrome.tabs.create({
                                            url: 'ui/options.html?action=import'
                                        });
                                    }
                                }
                            },

							svg: {
								component: 'svg',
								attr: {
									'viewBox': '0 0 24 24',
									'fill': 'none',
									'stroke': 'currentColor',
									'stroke-linecap': 'round',
									'stroke-linejoin': 'round',
									'stroke-width': '2'
								},

								path: {
									component: 'path',
									attr: {
										'd': 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3'
									}
								}
							},
							label: {
								component: 'span',
								text: 'import'
							}
						}
                    }
                },

                svg: {
                    component: 'svg',
                    attr: {
                        'viewBox': '0 0 24 24',
                        'fill': 'currentColor'
                    },

                    circle_1: {
                        component: 'circle',
                        attr: {
                            'cx': '12',
                            'cy': '5.25',
                            'r': '1'
                        }
                    },
                    circle_2: {
                        component: 'circle',
                        attr: {
                            'cx': '12',
                            'cy': '12',
                            'r': '1'
                        }
                    },
                    circle_3: {
                        component: 'circle',
                        attr: {
                            'cx': '12',
                            'cy': '18.75',
                            'r': '1'
                        }
                    }
                }
            }
		}
	},
	layers: {
		component: 'layers',
		on: {
			open: function () {
				var skeleton = this.path[this.path.length - 1],
					parent = skeleton.parent,
					section = this.base.skeleton.header.section_1,
					is_home = this.path.length <= 1,
					title = 'ToDo';

				if (parent) {
					if (parent.label) {
						title = parent.label.text;
					} else if (parent.text) {
						title = parent.text;
					}
				}

				section.back.rendered.hidden = is_home;
				section.title.rendered.innerText = satus.locale.get(title);

				if (this.path.length === 1) {
					updateLists();
				}
			}
		}
	},
	create: {
		component: 'button',
		variant: 'create',
		attr: {
			'title': 'create'
		},
		on: {
			click: {
				component: 'modal',

				title: {
					component: 'span',
					text: function () {
						if (skeleton.layers.rendered.path.length > 1) {
							return 'newTask';
						} else {
							return 'newList';
						}
					}
				},
				input: {
					component: 'input',
					type: 'text',
					autofocus: true,
					storage: false,
					on: {
						render: function () {
							this.focus();
						},
						keydown: function (event) {
							if (event.key === 'Enter') {
								this.parentNode.parentNode.skeleton.actions.create.rendered.click();
							}
						}
					}
				},
				actions: {
					component: 'section',
					variant: 'actions',

					create: {
						component: 'button',
						text: 'create',
						on: {
							click: function () {
								var path = skeleton.layers.rendered.path,
									modal = this.skeleton.parent.parent,
									name = modal.input.rendered.value;

								if (path.length > 1) {
									var layer = path[path.length - 1],
										task = {
											name: name,
											value: false,
											time: new Date().getTime()
										};

									layer.tasks.push(task);

									satus.empty(layer.rendered);

									updateTasks(layer.tasks);
								} else {
									lists.push({
										name: name,
										tasks: []
									});

									updateLists();
								}

								satus.storage.set('lists', lists);

								modal.rendered.close();
							}
						}
					}
				}
			}
		}
	}
};

function updateLists() {
	var layer = skeleton.layers.rendered.children[0],
		section = {
			component: 'section',
			variant: 'card'
		};

	satus.empty(layer);

	if (lists.length === 0) {
		section.span = {
			component: 'span',
			text: 'noLists',
			style: {
				'display': 'flex',
				'alignItems': 'center'
			}
		};
	}

	for (var i = 0, l = lists.length; i < l; i++) {
		var list = lists[i];

		section['list_' + i] = {
			component: 'button',
			variant: 'folder',
			attr: {
				title: list.name
			},
			list: list,
			sortable: true,
			contextMenu: {
				rename: {
					component: 'button',
					text: 'rename',
					on: {
						click: function () {
							var modal = this.parentNode.parentNode;

							satus.render({
								component: 'modal',
								parent: modal.skeleton.parent,

								title: {
									component: 'span',
									text: 'rename'
								},
								input: {
									component: 'input',
									type: 'text',
									autofocus: true,
									storage: false,
									value: modal.skeleton.parent.list.name,
									on: {
										render: function () {
											this.focus();
											this.select();
										},
										keydown: function (event) {
											if (event.key === 'Enter') {
												this.parentNode.parentNode.skeleton.actions.ok.rendered.click();
											}
										}
									}
								},
								actions: {
									component: 'section',
									variant: 'actions',

									cancel: {
										component: 'button',
										text: 'cancel',
										on: {
											click: function () {
												var modal = this.parentNode.parentNode.parentNode;

												modal.close();
											}
										}
									},
									ok: {
										component: 'button',
										text: 'ok',
										on: {
											click: function () {
												var modal = this.parentNode.parentNode.parentNode,
													item = modal.skeleton.parent;

												item.list.name = modal.skeleton.input.rendered.value;

												satus.storage.set('lists', lists);

												updateLists();

												modal.close();
											}
										}
									}
								}
							});

							modal.close();
						}
					}
				},
				remove: {
					component: 'button',
					text: 'remove',
					on: {
						click: function () {
							var modal = this.parentNode.parentNode,
								parent = modal.skeleton.parent;

							satus.remove(parent.list, lists);

							satus.storage.set('lists', lists);

							updateLists();

							modal.close();
						}
					}
				}
			},
			on: {
				click: {
					component: 'section',
					variant: 'card',
					tasks: list.tasks,
					on: {
						render: function () {
							updateTasks(this.skeleton.tasks);
						}
					}
				},
				sort: function () {
					var index = satus.indexOf(this);

					satus.toIndex(index, this.skeleton.list, lists);

					satus.storage.set('lists', lists);
				}
			},

			svg: {
				component: 'svg',
				attr: {
					'viewBox': '0 0 24 24',
					'fill': 'var(--satus-primary)'
				},

				path: {
					component: 'path',
					attr: {
						'd': 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'
					}
				}
			},
			label: {
				component: 'span',
				text: list.name
			}
		};
	}

	satus.empty(layer);
	satus.render(section, layer);
}

function updateTasks(tasks) {
	var path = skeleton.layers.rendered.path,
		section = path[path.length - 1].rendered;

	satus.empty(section);

	if (tasks.length === 0) {
		satus.render({
			component: 'span',
			text: 'noTasks',
			style: {
				'display': 'flex',
				'alignItems': 'center'
			}
		}, section);
	}

	for (var i = 0, l = tasks.length; i < l; i++) {
		var task = tasks[i];

		satus.render({
			component: 'checkbox',
			attr: {
				title: task.name
			},
			text: [task.name],
			value: task.value,
			storage: false,
			tasks: tasks,
			task: task,
			contextMenu: {
				rename: {
					component: 'button',
					text: 'rename',
					on: {
						click: function () {
							var modal = this.parentNode.parentNode;

							satus.render({
								component: 'modal',
								parent: modal.skeleton.parent,

								title: {
									component: 'span',
									text: 'rename'
								},
								input: {
									component: 'input',
									type: 'text',
									autofocus: true,
									storage: false,
									value: modal.skeleton.parent.task.name,
									on: {
										render: function () {
											this.focus();
											this.select();
										},
										keydown: function (event) {
											if (event.key === 'Enter') {
												this.parentNode.parentNode.skeleton.actions.ok.rendered.click();
											}
										}
									}
								},
								actions: {
									component: 'section',
									variant: 'actions',

									cancel: {
										component: 'button',
										text: 'cancel',
										on: {
											click: function () {
												var modal = this.parentNode.parentNode.parentNode;

												modal.close();
											}
										}
									},
									ok: {
										component: 'button',
										text: 'ok',
										on: {
											click: function () {
												var modal = this.parentNode.parentNode.parentNode,
													item = modal.skeleton.parent;

												item.task.name = modal.skeleton.input.rendered.value;

												satus.storage.set('lists', lists);

												updateTasks(item.tasks);

												modal.close();
											}
										}
									}
								}
							});

							modal.close();
						}
					}
				},
				remove: {
					component: 'button',
					text: 'remove',
					on: {
						click: function () {
							var path = skeleton.layers.rendered.path,
								layer = path[path.length - 1],
								modal = this.parentNode.parentNode,
								parent = modal.skeleton.parent;

							satus.remove(parent.task, parent.tasks);

							satus.storage.set('lists', lists);

							updateTasks(parent.tasks);

							modal.close();
						}
					}
				}
			},
			sortable: true,
			on: {
				change: function () {
					this.skeleton.task.value = this.storageValue;

					satus.storage.set('lists', lists);
				},
				sort: function () {
					var index = satus.indexOf(this);

					satus.toIndex(index, this.skeleton.task, this.skeleton.tasks);

					satus.storage.set('lists', lists);
				}
			}
		}, section);
	}
}

function crypt(mode, data, callback) {
	satus.render({
        component: 'modal',
        parent: this.skeleton,
        
        title: {
            component: 'span',
            text: mode ? 'encryption' : 'decryption'
        },
        input: {
            component: 'input',
            type: 'password',
            on: {
            	render: function() {
                    this.focus();
                },
                keydown: async function(event) {
                    if (event.key === 'Enter') {
						this.parentNode.parentNode.skeleton.actions.ok.rendered.click();
					}
                }
            }
        },
        actions: {
            component: 'section',
            variant: 'actions',
            
            ok: {
                component: 'button',
                text: 'ok',
                on: {
                	click: async function() {
                		var modal = this.skeleton.parent.parent,
							input = modal.input.rendered;

                        if (input.value.length > 1) {
                            if (mode) {
                            	data = await satus.encrypt(data, input.value);
                                password = input.value;
                            } else {
                            	data = JSON.parse(await satus.decrypt(data, input.value));
                                password = input.value;
                            }

                            if (callback) {
                            	callback(mode, data);
                            }
                            
                            modal.rendered.close();
                        } else {
                            input.classList.add('error');
                        }
                    }
                }
            }
        }
    });
}

function exportData() {
	if (location.href.indexOf('action=export') !== -1) {
        var blob;

        try {
        	blob = new Blob([JSON.stringify(satus.storage.data)], {
		        type: 'application/json;charset=utf-8'
		    });
        } catch (error) {
        	return modalError(error);
        }

	    satus.render({
	    	component: 'modal',

	    	label: {
	    		component: 'span',
	    		text: 'areYouSureYouWantToExportTheData'
	    	},
	    	actions: {
	    		component: 'section',
	    		variant: 'actions',

	    		ok: {
					component: 'button',
					text: 'ok',
					on: {
						click: function () {
							try {
								chrome.permissions.request({
				                    permissions: ['downloads']
				                }, function (granted) {
				                    if (granted) {
				                        chrome.downloads.download({
				                            url: URL.createObjectURL(blob),
				                            filename: 'todo.json',
				                            saveAs: true
				                        }, function () {
				                            setTimeout(function () {
				                            	close();
				                            }, 1000);
				                        });
				                    }
				                });
				            } catch (error) {
			                	return modalError(error);
			                }

							this.parentNode.parentNode.parentNode.close();
						}
					}
				},
				cancel: {
					component: 'button',
					text: 'cancel',
					on: {
						click: function () {
							this.parentNode.parentNode.parentNode.close();
						}
					}
				}
	    	}
	    });
    }
}

function importData() {
	if (location.href.indexOf('action=import') !== -1) {
        satus.render({
	    	component: 'modal',

	    	label: {
	    		component: 'span',
	    		text: 'areYouSureYouWantToImportTheData'
	    	},
	    	actions: {
	    		component: 'section',
	    		variant: 'actions',

	    		ok: {
					component: 'button',
					text: 'ok',
					on: {
						click: function () {
							var input = document.createElement('input');

			                input.type = 'file';

			                input.addEventListener('change', function () {
			                    var file_reader = new FileReader();

			                    file_reader.onload = function () {
			                        var data = JSON.parse(this.result);

			                        for (var key in data) {
			                            satus.storage.set(key, data[key]);
			                        }

			                        close();
			                    };

			                    file_reader.readAsText(this.files[0]);
			                });

			                input.click();

							this.parentNode.parentNode.parentNode.close();
						}
					}
				},
				cancel: {
					component: 'button',
					text: 'cancel',
					on: {
						click: function () {
							this.parentNode.parentNode.parentNode.close();
						}
					}
				}
	    	}
	    });
    }
}

async function encr(callback) {
	data = await satus.encrypt(JSON.stringify(lists), password);
	
	satus.storage.set('lists', data);
    satus.storage.set('encrypted', true);
	satus.storage.set('data', null);

	callback();
}

function migrateData(callback) {
	var data = satus.storage.get('data');

	function change(data, callback) {
		lists = [];

		try {
			if (typeof data === 'string') {
				data = JSON.parse(data);
			}

			for (var i = 0, l = data.lists.length; i < l; i++) {
				var list = data.lists[i];

				lists.push({
					name: list.name,
					tasks: []
				});

				for (var j = 0, k = list.items.length; j < k; j++) {
					var task = list.items[j];

					lists[i].tasks.push({
						name: task.name,
						value: task.value,
						date: new Date().getTime()
					});
				}
			}

			encr(callback);
		} catch (error) {
			console.log(error);

			callback();
		}
	}

	if (data) {
		if (satus.storage.get('encrypted')) {
			crypt(false, data, function (mode, data) {
				change(data, callback);
			});
		} else {
			change(data, callback);
		}
	} else {
		callback();
	}
}


/*--------------------------------------------------------------
# INITIALIZATION
--------------------------------------------------------------*/

satus.storage.attributes = {
    theme: true
};

satus.storage.import(function (items) {
	satus.locale.import(items.language, '../_locales/', function () {
		migrateData(function() {
			if (lists.length > 0) {
				satus.render(skeleton);
			} else if (Array.isArray(satus.storage.get('lists'))) {
				lists = satus.storage.get('lists');

				satus.render(skeleton);
			} else if (satus.storage.get('encrypted') === true) {
				crypt(false, satus.storage.get('lists'), function (mode, data) {
					lists = data;

					satus.render(skeleton);
				});
			} else {
				satus.render(skeleton);
			}

			exportData();
			importData();
		});
	});
});