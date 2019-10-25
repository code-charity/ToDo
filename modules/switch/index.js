'use strict';

/*------------------------------------------------------------------------------
>>> MODULE: SWITCH
------------------------------------------------------------------------------*/

Satus.switch = function(object) {
    let self = this,
        element = document.createElement('div'),
        label = object.label,
        value = Satus.get(object.storage);

    element.innerHTML = (label ? '<div class=label>' + label + '</div>' : '') +
        '<div class=container>' +
        ((object.icons || {}).start || '') + '<div class=track><div class=thumb></div></div>' + ((object.icons || {}).end || '') +
        '</div>';

    element.dataset.value = value || object.value || false;

    element.addEventListener('click', function(event) {
        if (this.dataset.value == 'true') {
            this.dataset.value = 'false';
        } else {
            this.dataset.value = 'true';
        }

        Satus.set(object.storage, this.dataset.value === 'true');
    });

    return element;
};