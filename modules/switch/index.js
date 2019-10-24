'use strict';

/*------------------------------------------------------------------------------
>>> MODULE: SWITCH
------------------------------------------------------------------------------*/

Satus.switch = function(object) {
    let self = this,
        element = document.createElement('div'),
        label = object.label;

    element.innerHTML = (label ? '<div class=label>' + label + '</div>' : '') +
        '<div class=container>' +
        ((object.icons || {}).start || '') + '<div class=track><div class=thumb></div></div>' + ((object.icons || {}).end || '') +
        '</div>';

    element.dataset.value = object.value || false;

    element.addEventListener('click', function(event) {
        if (element.dataset.value == 'true') {
            element.dataset.value = 'false';
        } else {
            element.dataset.value = 'true';
        }
    });

    return element;
};