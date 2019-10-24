/*-----------------------------------------------------------------------------
>>> MODULE: RENDER
-------------------------------------------------------------------------------*/

Satus.render = function(container, object) {
    for (let key in object) {
        let item = object[key];

        if (
            typeof item === 'object' &&
            typeof item.type === 'string' &&
            typeof this[item.type] === 'function'
        ) {
            let element = this[item.type](item, key);

            if (element) {
                element.classList.add('satus-' + item.type);

                /*-------------------------------------------------------------
                # Properties
                -------------------------------------------------------------*/

                for (let property in item)
                    if (
                        property !== 'type' &&
                        property !== 'class' &&
                        property !== 'on' &&
                        (
                            typeof item[property] === 'object' ?
                            !item[property].hasOwnProperty('type') :
                            true
                        )
                    )
                        element[property] = item[property];


                    /*-------------------------------------------------------------
                    # Class
                    -------------------------------------------------------------*/
                if (Array.isArray(item.class))
                    for (let i = 0, l = item.class.length; i < l; i++)
                        element.classList.add(item.class[i]);


                /*-------------------------------------------------------------
                # Events
                -------------------------------------------------------------*/

                if (item.hasOwnProperty('on'))
                    for (let property in item.on)
                        if (property !== 'render')
                            element.addEventListener(property, item.on[property]);
                        else
                            item.on['render'](element);

                element.satusItem = item;

                container.appendChild(element);
            }
        }
    }
};