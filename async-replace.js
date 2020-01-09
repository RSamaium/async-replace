function toLocal(regexp) {
    var flags = '';
    if (regexp.ignoreCase) flags += 'i';
    var copy = new RegExp(regexp.source, flags);
    return copy;
}

function replaceLocal(string, regexp, replacer) {
    return new Promise((resolve, reject) => {
        var matched = string.match(regexp);
        if (!matched) return resolve(string)
        var args = matched.slice();
        args.push(matched.index);
        args.push(matched.input);
        args.push(function (err, newString) {
            if (err) return reject(err);
            resolve(string.replace(regexp, newString));
        });
        replacer.apply(null, args);
    })
}

module.exports = function (string, regexp, replacer = function() {}) {
    if (!regexp.global) return replaceLocal(string, regexp, replacer);

    var matched = string.match(regexp);

    if (!matched) {
        return Promise.resolve(string)
    }

    // matched is an array of matched strings
    var result = [];
    var i = 0;
    var index = 0;
    var copy = toLocal(regexp);
    copy.global = false;
    var callbacks = [];
    while (matched.length > 0) {
        var subString = matched.shift();
        var nextIndex = string.indexOf(subString, index);
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