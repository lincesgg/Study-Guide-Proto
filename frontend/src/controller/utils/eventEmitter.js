// Simple Polyfill for "node:events" EventEmitter

function createEventEmitter() {
    // Subsctibing to Events
    const eventsListeners = {};

    // Utils ---
    function getListenerIndex(eventName, listener) {
        if (!eventsListeners[eventName])
            return -1

        const subscribedListeners = eventsListeners[eventName]
        const listenerIndex = subscribedListeners.indexOf(listener)
        return listenerIndex
    }


    // Adding Listeners
    function on(eventName, listenerFunc) {

        if (eventsListeners[eventName] == undefined) 
            eventsListeners[eventName] = []

        if (getListenerIndex(eventName, listenerFunc) !== -1)
            throw Error("listenerFunc is Alredy Subscribed to this Event!")

        if (typeof listenerFunc !== "function")
            throw Error("listenerFunc Must Be An Function!")

        eventsListeners[eventName].push(listenerFunc)
    }
    
    // ---
    function removeListener(eventName, listenerFunc) {
        const listenerIdx = getListenerIndex(eventName, listenerFunc)
        if (listenerIdx === -1) 
            throw Error("This Listener No Exists!")

        const listeners = eventsListeners[eventName]
        if (!listeners)
            return

         listeners.splice(listenerIdx, 1)

        if (listeners.length <= 0)
            delete eventsListeners[eventsListeners]
    }


    // ---
    function emit(eventName, ...args) {
        const subscribedListeners = eventsListeners[eventName]
        if (!subscribedListeners) return

        for (const listener of subscribedListeners) {
            listener(...args)
        }
    }

    // ---
    function listeners(eventName) {
        return eventsListeners[eventName] ?? []
    }



    return {
        on, 
        removeListener,
        emit,
        listeners
    }
}

export default createEventEmitter