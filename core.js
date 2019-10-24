/*-----------------------------------------------------------------------------
>>> SATUS CORE
-----------------------------------------------------------------------------*/

const Satus = {
    data: {},
    events: { get: [], set: [] },
    
    get: function(name, on) {
        if (on !== false)
            for (let i = 0, l = this.events.get.length; i < l; i++)
                this.events.get[i](name);

        return this.data[name];
    },
    set: function(name, value, on) {
        if (on !== false)
            for (let i = 0, l = this.events.set.length; i < l; i++)
                this.events.set[i](name, value);

        this.data[name] = value;
    },
    on: function(name, callback) {
        this.events[name].push(callback);
    }
};