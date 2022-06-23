/*--------------------------------------------------------------
>>> SKELETON
----------------------------------------------------------------
# Base
# Header
# Main
# Create
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# BASE
--------------------------------------------------------------*/

extension.skeleton = {
	component: 'base'
};


/*--------------------------------------------------------------
# HEADER
--------------------------------------------------------------*/

extension.skeleton.header = {
	component: 'header',

	sectionStart: {
		component: 'section',
		variant: 'align-start',

		back: {
			component: 'button',
			variant: 'icon',
			attr: {
				'hidden': 'true'
			},
			on: {
				click: 'main.layers.back'
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
	sectionEnd: {
		component: 'section',
		variant: 'align-end',

		menu: {
			component: 'button',
			variant: 'icon',
			on: {
				click: {
					component: 'modal',
					variant: 'vertical-menu',

					label: {
						component: 'span',
						text: 'theme'
					},
					theme: {
						component: 'tabs',
						items: [
							'light',
							'dark'
						],
						value: function () {
							return satus.storage.get('theme') === 'dark' ? 1 : 0;
						},
						on: {
							click: function () {
								if (this.value === 1) {
									satus.storage.set('theme', 'dark');

									document.body.setAttribute('theme', 'dark');
								} else {
									satus.storage.remove('theme');

									document.body.removeAttribute('theme');
								}
							}
						}
					},
					divider: {
						component: 'divider'
					},
					language: {
						component: 'select',
						before: {
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
						text: 'language',
						on: {
							change: function (name, value) {
								var language = satus.storage.get('language');

								if (!language || language === 'default') {
									language = window.navigator.language;
								}

								satus.locale.import(language, function () {
									var layers = document.querySelector('.satus-layers');

									extension.skeleton.main.layers.rendered.dispatchEvent(new CustomEvent('open'));

									satus.empty(layers.firstChild);

									satus.render(satus.last(layers.path), layers.firstChild, undefined, true);
								}, '_locales/');
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
						}]
					},
					encrypted: {
						component: 'switch',
						text: 'encryption',
						before: {
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
						storage: false,
						value: function () {
							return satus.storage.get('encrypted');
						},
						on: {
							change: function () {
								var component = this;

								if (this.storage.value === true) {
									extension.crypt(this.dataset.value === 'true', JSON.stringify(extension.lists), function (mode, data) {
										satus.storage.set('encrypted', true);

										component.dataset.value = 'true';

										satus.storage.set('lists', data);
									}, component);
								} else {
									satus.storage.remove('encrypted');

									component.dataset.value = 'false';

									satus.storage.set('lists', extension.lists);
								}
							}
						}
					},
					export: {
						component: 'button',
						before: {
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
						text: 'export',
						on: {
							click: function () {
								if (location.href.indexOf('options-page/index.html?action=export-settings') !== -1) {
									extension.exportSettings();
								} else {
									chrome.tabs.create({
										url: 'options-page/index.html?action=export-settings'
									});
								}
							}
						}
					},
					import: {
						component: 'button',
						before: {
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
						text: 'import',
						on: {
							click: function () {
								if (location.href.indexOf('options-page/index.html?action=import-settings') !== -1) {
									extension.importSettings();
								} else {
									chrome.tabs.create({
										url: 'options-page/index.html?action=import-settings'
									});
								}
							}
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
};


/*--------------------------------------------------------------
# MAIN
--------------------------------------------------------------*/

extension.skeleton.main = {
	component: 'main',

	layers: {
		component: 'layers',
		on: {
			open: function () {
				var skeleton = satus.last(this.path),
					section = this.baseProvider.skeleton.header.sectionStart,
					title = satus.manifest().name;

				if (skeleton.parentSkeleton) {
					if (skeleton.parentSkeleton.label) {
						title = skeleton.parentSkeleton.label.text;
					} else if (skeleton.parentSkeleton.text) {
						title = skeleton.parentSkeleton.text;
					}
				}

				section.back.rendered.hidden = this.path.length <= 1;
				section.title.rendered.innerText = satus.locale.get(title);

				if (this.path.length <= 1) {
					extension.updateLists();
				}

				var vertical_menu = document.querySelector('.satus-modal--vertical-menu');

				if (vertical_menu) {
					vertical_menu.close();
				}
			}
		}
	}
};


/*--------------------------------------------------------------
# CREATE
--------------------------------------------------------------*/

extension.skeleton.create = {
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
					if (extension.skeleton.main.layers.rendered.path.length > 1) {
						return 'newTask';
					} else {
						return 'newList';
					}
				}
			},
			input: {
				component: 'input',
				attr: {
					type: 'text',
					autofocus: 'true'
				},
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
							var path = extension.skeleton.main.layers.rendered.path,
								modal = this.skeleton.parentSkeleton.parentSkeleton,
								name = modal.input.rendered.value;

							if (path.length > 1) {
								var layer = satus.last(path),
									task = {
										name: name,
										value: false,
										time: new Date().getTime()
									};

								layer.tasks.push(task);

								satus.empty(layer.rendered);

								extension.updateTasks(layer.tasks);
							} else {
								extension.lists.push({
									name: name,
									tasks: []
								});

								extension.updateLists();
							}

							extension.updateData();

							modal.rendered.close();
						}
					}
				}
			}
		}
	}
};