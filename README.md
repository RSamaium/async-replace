# async-replace-promise

Run replace on a string and update it asynchronous.

It's fork of https://github.com/kesla/async-replace but:

- No dependencies
- Returns a promise
- Works in strict mode
- Tiny : < 0.6 Ko after minification of the file

## Install

`npm install async-replace-promise`

## usage

async-replace have the same api as the callback-version of `String.prototype.replace` but instead of returning the changed data another callback is called, making it possible to do asynchronous stuff in the callback.

This may sound more complicated than it is, so let's look at an example.

Above is an example of using `String.prototype.replace` with a callback. The above could then be written in async-replace like this

```js
import asyncReplace from 'async-replace-promise'
// or const asyncReplace = require('async-replace-promise');

(async function() {
    
    const replacer = (match, p1, p2, p3, offset, string) => {
        // p1 is nondigits, p2 digits, and p3 non-alphanumerics
        return new Promise(resolve => {
             setTimeout(() => {
                resolve([p1, p2, p3].join(' - '))
            }, 100);
        })
    }

    try {
        const result = await asyncReplace("abc12345#$*%", /([^\d]*)(\d*)([^\w]*)/, replacer)
        console.log(result); // will print 'abc - 12345 - #$*%';
    }
    catch (err) {
        console.log(err)
    }

})()
```