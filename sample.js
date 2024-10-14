import asyncReplace from './async-replace';
(async function() {
    
    const replacer = (match, p1, p2, p3, offset, string) => {
        // p1 is nondigits, p2 digits, and p3 non-alphanumerics
        return new Promise(resolve => {
             setTimeout(() => {
                resolve([p1, p2, p3].join(' - '))
            }, 0);
        })
    }

    try {
        console.time('asyncReplace');
        const result = await asyncReplace("abc12345#$*%", /([^\d]*)(\d*)([^\w]*)/g, replacer)
        console.timeEnd('asyncReplace');
        console.log(result); // will print 'abc - 12345 - #$*%';
    }
    catch (err) {
        console.log(err)
    }

})()