'use strict'

function toLocal(regexp) {
    let flags = '';
    if (regexp.ignoreCase) flags += 'i';
    const copy = new RegExp(regexp.source, flags);
    return copy;
}

function replaceLocal(string, regexp, replacer) {
    return new Promise((resolve, reject) => {
        const matched = string.match(regexp);
        if (!matched) return resolve(string)
        const args = matched.slice();
        args.push(matched.index);
        args.push(matched.input);
        args.push(function (err, newString) {
            if (err) return reject(err);
            resolve(string.replace(regexp, newString));
        });
        replacer.apply(null, args);
    })
}

module.exports = function (string, regexp, replacer = function () {}) {
    if (!regexp.global) return replaceLocal(string, regexp, replacer);

    const matched = string.match(regexp);

    if (!matched) {
        return Promise.resolve(string)
    }

    let i = 0;
    let index = 0;

    const result = [];
    const copy = toLocal(regexp);
    const callbacks = [];
    while (matched.length > 0) {
        const subString = matched.shift();
        const nextIndex = string.indexOf(subString, index);
        result[i] = string.slice(index, nextIndex);
        i++;
        (function (j, index, subString) {
            callbacks.push(new Promise((resolve, reject) => {
                var match = subString.match(copy);
                var args = match.slice();
                args.push(index);
                args.push(string);
                args.push(function (err, newString) {
                    if (err) return reject(err);
                    result[j] = newString;
                    resolve(null);
                });
                replacer.apply(null, args);
            }));
        })(i, nextIndex, subString);

        index = nextIndex + subString.length;
        i++;
    }
    result[i] = string.slice(index);
    return Promise.all(callbacks).then(() => result.join(''))
}