function replaceLocal(string, regexp, replacer) {
    const matched = string.match(regexp)
    if (!matched) return Promise.resolve(string)
    return replacer(...[
        ...matched,
        matched.index,
        matched.input
    ]).then((newString) => string.replace(regexp, newString))
}

module.exports = function (string, regexp, replacer = function () {}) {
    if (!regexp.global) return replaceLocal(string, regexp, replacer)

    const matched = string.match(regexp)

    if (!matched) {
        return Promise.resolve(string)
    }

    let i = 0
    let index = 0
    const result = []
    const copy = new RegExp(regexp.source, regexp.flags.replace('g', ''))
    const callbacks = []
    while (matched.length > 0) {
        const subString = matched.shift()
        const nextIndex = string.indexOf(subString, index)
        result[i] = string.slice(index, nextIndex)
        i++
        let j = i
        callbacks.push(replacer(...[
            ...subString.match(copy),
            nextIndex,
            string
        ]).then(newString => {
            result[j] = newString
        }))
        index = nextIndex + subString.length
        i++
    }
    result[i] = string.slice(index)
    return Promise.all(callbacks).then(() => result.join(''))
}