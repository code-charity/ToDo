'use strict';

/*------------------------------------------------------------------------------
>>> MODULE: CHECKBOX
------------------------------------------------------------------------------*/

Satus.checkbox = function(object) {
    let self = this,
        element = document.createElement('div'),
        label = object.label,
        value = Satus.get(object.storage);

    element.innerHTML = (label ? '<div class=label>' + label + '</div>' : '') +
        '<div class=satus-checkbox__checkmark><svg viewBox="0 0 24 24"><path fill=none d="M1.73,12.91 8.1,19.28 22.79,4.59"></path></svg></div>';

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