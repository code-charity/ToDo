Satus.on('renderer', function(element, object) {
    if (object.contextmenu) {
        element.addEventListener('contextmenu', function(event) {
            event.preventDefault();

            let container = document.createElement('div'),
                shadow = document.createElement('div'),
                contextmenu = document.createElement('div');

            container.className = 'satus-contextmenu';
            shadow.className = 'satus-contextmenu__shadow';
            contextmenu.className = 'satus-contextmenu__menu';

            contextmenu.style.left = event.clientX + 'px';
            contextmenu.style.top = event.clientY + 'px';

            shadow.addEventListener('click', function() {
                this.parentNode.remove();
            });

            Satus.render(contextmenu, object.contextmenu);

            container.appendChild(shadow);
            container.appendChild(contextmenu);
            document.body.appendChild(container);

            return false;
        });
    }
});