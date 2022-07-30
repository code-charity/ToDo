/*--------------------------------------------------------------
>>> FUNCTIONS
----------------------------------------------------------------
# Export settings
# Import settings
# Update lists
# Update tasks
# Update data
# Encryption
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# EXPORT SETTINGS
--------------------------------------------------------------*/

extension.exportSettings = function (file_only, callback) {
	if (file_only) {
		var blob = new Blob([JSON.stringify(satus.storage.data)], {
				type: 'application/json;charset=utf-8'
			});

		chrome.permissions.request({
			permissions: ['downloads']
		}, function (granted) {
			if (granted) {
				chrome.downloads.download({
					url: URL.createObjectURL(blob),
					filename: 'todo.json',
					saveAs: true
				}, callback);
			}
		});
	} else if (location.href.indexOf('action=export-settings') !== -1) {
		satus.render({
			component: 'modal',
			variant: 'confirm',
			content: 'areYouSureYouWantToExportTheData',
			buttons: {
				cancel: {
					component: 'button',
					text: 'cancel',
					on: {
						click: function () {
							this.modalProvider.close();
						}
					}
				},
				ok: {
					component: 'button',
					text: 'ok',
					on: {
						click: function () {
							extension.exportSettings(true, function () {
								setTimeout(function () {
									close();
								}, 1000);
							});
						}
					}
				}
			}
		}, extension.skeleton.rendered);

		return true;
	}
};


/*--------------------------------------------------------------
# IMPORT SETTINGS
--------------------------------------------------------------*/

extension.importSettings = function (file_only, callback) {
	if (file_only) {
		var input = document.createElement('input');

		input.type = 'file';

		input.addEventListener('change', function () {
			var file_reader = new FileReader();

			file_reader.onload = function () {
				var data = JSON.parse(this.result);

				for (var key in data) {
					satus.storage.set(key, data[key]);
				}

				setTimeout(function () {
					chrome.runtime.sendMessage({
						action: 'import-settings'
					});

					callback();
				}, 256);
			};

			file_reader.readAsText(this.files[0]);
		});

		input.click();
	} else if (location.href.indexOf('action=import-settings') !== -1) {
		satus.render({
			component: 'modal',
			variant: 'confirm',
			content: 'areYouSureYouWantToImportTheData',
			buttons: {
				cancel: {
					component: 'button',
					text: 'cancel',
					on: {
						click: function () {
							this.modalProvider.close();
						}
					}
				},
				ok: {
					component: 'button',
					text: 'ok',
					on: {
						click: function () {
							extension.importSettings(true, function () {
								setTimeout(function () {
									close();
								}, 1000);
							});
						}
					}
				}
			}
		}, extension.skeleton.rendered);
	}
};


/*--------------------------------------------------------------
# UPDATE LISTS
--------------------------------------------------------------*/

extension.updateLists = function () {
	var layer = satus.last(extension.skeleton.main.layers.rendered.children),
		section = {
			component: 'section',
			variant: 'card'
		};

	if (extension.lists.length === 0) {
		section.span = {
			component: 'span',
			text: 'noLists',
			style: {
				'display': 'flex',
				'alignItems': 'center'
			}
		};
	}

	for (var i = 0, l = extension.lists.length; i < l; i++) {
		var list = extension.lists[i];

		section['list_' + i] = {
			component: 'button',
			variant: 'folder',
			attr: {
				title: list.name
			},
			text: list.name,
			before: {
				component: 'svg',
				attr: {
					'viewBox': '0 0 24 24',
					'fill': list.color || extension.color[0]
				},

				path: {
					component: 'path',
					attr: {
						'd': extension.icons[list.icon] || extension.icons['folder']
					}
				}
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
								parentSkeleton: modal.skeleton.parentSkeleton,

								title: {
									component: 'span',
									text: 'rename'
								},
								input: {
									component: 'input',
									type: 'text',
									attr: {
										type: 'text',
										autofocus: true,
										value: modal.skeleton.parentSkeleton.list.name
									},
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
													item = modal.skeleton.parentSkeleton;

												item.list.name = modal.skeleton.input.rendered.value;

												extension.updateData();

												extension.updateLists();

												modal.close();
											}
										}
									}
								}
							}, modal.baseProvider);

							modal.close();
						}
					}
				},
				changeIcon: {
					component: 'button',
					text: 'changeIcon',
					on: {
						click: function () {
							var modal = this.parentNode.parentNode;

							satus.render({
								component: 'modal',
								parentSkeleton: modal.skeleton,

								label: {
									component: 'span',
									text: 'icons'
								},
								grid: {
									component: 'section',
									variant: 'grid',
									style: {
										margin: '12px 0 6px',
										justifyContent: 'center'
									},
									on: {
										render: function () {
											var list = this.skeleton.parentSkeleton.parentSkeleton.parentSkeleton.list;

											for (var key in extension.icons) {
												var skeleton = {
													component: 'button',
													data: {
														key: key
													},
													on: {
														click: function () {
															var modal = this.skeleton.parentSkeleton.parentSkeleton,
																list = modal.parentSkeleton.parentSkeleton.list;

															list.icon = this.dataset.key;

															extension.updateData();

															extension.updateLists();

															modal.rendered.close();
														}
													},

													svg: {
														component: 'svg',
														attr: {
															'viewBox': '0 0 24 24',
															'fill': 'currentColor'
														},

														path: {
															component: 'path',
															attr: {
																'd': extension.icons[key]
															}
														}
													}
												};

												if (
													satus.isset(list.icon) === false && key === 'folder' ||
													list.icon === key
												) {
													skeleton.svg.attr.fill = 'var(--satus-primary)';
												}

												satus.render(skeleton, this);
											}
										}
									}
								}
							}, modal.baseProvider);

							modal.close();
						}
					}
				},
				changeColor: {
					component: 'button',
					text: 'changeColor',
					on: {
						click: function () {
							var modal = this.parentNode.parentNode;

							satus.render({
								component: 'modal',
								parentSkeleton: modal.skeleton,

								label: {
									component: 'span',
									text: 'color'
								},
								grid: {
									component: 'section',
									variant: 'grid',
									style: {
										margin: '12px 0 6px',
										justifyContent: 'center'
									},
									on: {
										render: function () {
											var list = this.skeleton.parentSkeleton.parentSkeleton.parentSkeleton.list;

											for (var color of extension.color) {
												var skeleton = {
													component: 'button',
													data: {
														color
													},
													on: {
														click: function () {
															var modal = this.skeleton.parentSkeleton.parentSkeleton,
																list = modal.parentSkeleton.parentSkeleton.list;

															list.color = this.dataset.color;

															extension.updateData();

															extension.updateLists();

															modal.rendered.close();
														}
													},

													circle: {
														component: 'span',
														style: {
															width: '20px',
															height: '20px',
															backgroundColor: color,
															borderRadius: '50%'
														}
													}
												};

												/*if (
													satus.isset(list.color) === false && color === list.color[0] ||
													list.color === color
												) {
													skeleton.svg.attr.fill = 'var(--satus-primary)';
												}*/

												satus.render(skeleton, this);
											}
										}
									}
								}
							}, modal.baseProvider);

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
								parent = modal.skeleton.parentSkeleton;

							satus.remove(parent.list, extension.lists);

							extension.updateData();

							extension.updateLists();

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
							extension.updateTasks(this.skeleton.tasks);
						}
					}
				},
				sort: function () {
					var index = satus.indexOf(this);

					satus.toIndex(index, this.skeleton.list, extension.lists);

					extension.updateData();
				}
			}
		};
	}

	satus.empty(layer);

	satus.render(section, layer);
};


/*--------------------------------------------------------------
# UPDATE TASKS
--------------------------------------------------------------*/

extension.updateTasks = function (tasks) {
	var path = extension.skeleton.main.layers.rendered.path,
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
								parentSkeleton: modal.skeleton.parentSkeleton,

								title: {
									component: 'span',
									text: 'rename'
								},
								input: {
									component: 'input',
									attr: {
										type: 'text',
										autofocus: true,
										value: modal.skeleton.parentSkeleton.task.name
									},
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
													item = modal.skeleton.parentSkeleton;

												item.task.name = modal.skeleton.input.rendered.value;

												extension.updateData();

												extension.updateTasks(item.tasks);

												modal.close();
											}
										}
									}
								}
							}, modal.baseProvider);

							modal.close();
						}
					}
				},
				remove: {
					component: 'button',
					text: 'remove',
					on: {
						click: function () {
							var path = extension.skeleton.main.layers.rendered.path,
								layer = path[path.length - 1],
								modal = this.parentNode.parentNode,
								parent = modal.skeleton.parent;

							satus.remove(parent.task, parent.tasks);

							extension.updateData();

							extension.updateTasks(parent.tasks);

							modal.close();
						}
					}
				}
			},
			sortable: true,
			on: {
				change: function () {
					console.log(this.skeleton.task);
					this.skeleton.task.value = this.storage.value;

					extension.updateData();
				},
				sort: function () {
					var index = satus.indexOf(this);

					satus.toIndex(index, this.skeleton.task, this.skeleton.tasks);

					extension.updateData();
				}
			}
		}, section);
	}
};


/*--------------------------------------------------------------
# UPDATE DATA
--------------------------------------------------------------*/

extension.updateData = function () {
	if (satus.storage.get('encrypted') === true && extension.password) {
		extension.encr();
	} else {
		satus.storage.set('lists', extension.lists);
	}
};


/*--------------------------------------------------------------
# ENCRYPTION
--------------------------------------------------------------*/

extension.crypt = function (mode, data, callback, component) {
	satus.render({
		component: 'modal',
		parentSkeleton: component ? component.skeleton : undefined,
		on: {
			close: function () {
				if (this.skeleton.parentSkeleton) {
					var component = this.skeleton.parentSkeleton.parentSkeleton.encrypted.rendered;

					if (satus.storage.get('encrypted') === true) {
						component.dataset.value = 'true';
					} else {
						component.dataset.value = 'false';
					}
				}
			}
		},

		title: {
			component: 'span',
			text: mode ? 'encryption' : 'decryption'
		},
		input: {
			component: 'input',
			attr: {
				type: 'password'
			},
			on: {
				render: function () {
					this.focus();
				},
				keydown: async function (event) {
					this.classList.remove('satus-input--error');

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
					click: async function () {
						var modal = this.skeleton.parentSkeleton.parentSkeleton,
							input = modal.input.rendered,
							result = false;

						if (input.value.length > 1) {
							if (mode) {
								result = await satus.encrypt(data, input.value);
								extension.password = input.value;
							} else {
								result = JSON.parse(await satus.decrypt(data, input.value));
								extension.password = input.value;
							}

							if (result) {
								callback(mode, result);

								if (modal.rendered.baseProvider.skeleton.variant === 'temporary') {
									modal.rendered.baseProvider.remove();
								}

								modal.rendered.close();
							} else {
								input.classList.add('satus-input--error');
							}
						} else {
							input.classList.add('satus-input--error');
						}
					}
				}
			}
		}
	}, extension.skeleton.rendered);
};

extension.encr = async function (callback) {
	satus.storage.set('lists', await satus.encrypt(JSON.stringify(extension.lists), extension.password));
	satus.storage.set('encrypted', true);
	satus.storage.remove('data');

	if (callback) {
		callback();
	}
};