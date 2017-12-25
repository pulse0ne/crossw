/**
 * @param {Function} func
 * @param {Number} delay
 * @returns {Function}
 */
export function debounce (func, delay) {
    let t;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(t);
        t = setTimeout(() => func.apply(context, args), delay);
    };
}

/**
 * @param {Number} start
 * @param {Number} [end]
 * @returns {Array}
 */
export function range (start, end) {
    if (end === undefined) {
        end = start;
        start = 0;
    }
    const arr = [];
    for (let i = start; i <= end; i++) {
        arr.push(i);
    }
    return arr;
}

/**
 * @param {Number} count
 * @param {Function} func
 */
export function iterFunc (count, func) {
    for (let i = 0; i < count; i++) {
        func(i);
    }
}

/**
 * @param {Number} size
 * @param {*} [val]
 * @returns {Array}
 */
export function arrayFill (size, val=0) {
    return range(size).map(i => val);
}

/**
 * @param {String} key
 * @param {*} defaultValue
 * @returns {Proxy}
 */
export function localStorageProxy (key, defaultValue={}) {
    let stored = window.localStorage.getItem(key);
    if (!stored) {
        stored = defaultValue;
        window.localStorage.setItem(key, JSON.stringify(stored));
    } else {
        stored = JSON.parse(stored);
    }

    return new Proxy(stored, {
        set: function (target, name, value) {
            target[name] = value;
            window.localStorage.setItem(key, JSON.stringify(target));
            return true;
        }
    });
}
