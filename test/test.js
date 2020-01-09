var test = require('tap').test;

var asyncReplace = require('../async-replace');

test('async-replace', function(t) {
    t.test('no match local', async function(t) {
        const newString = await asyncReplace('aaa', /(\d)/)
        t.equal(newString, 'aaa');
        t.end();
    });

    t.test('no match global', async function(t) {
        const newString = await asyncReplace('aaa', /(\d)/g)
        t.equal(newString, 'aaa');
        t.end();
    });


    t.test('simple local', async function(t) {
        const newString = await asyncReplace(' foo ', /(fo)(.)/, async function(match, p1, p2, offset, input) {
            t.equal(match, 'foo');
            t.equal(p1, 'fo');
            t.equal(p2, 'o');
            t.equal(offset, 1);
            t.equal(input, ' foo ');
            return p2 + '-' + p1
        })
        t.equal(newString, ' o-fo ');
        t.end();
    });


    t.test('simple global', async function(t) {
        const newString = await asyncReplace(' foo ', /(fo)(.)/g, async function(match, p1, p2, offset, input, callback) {
            t.equal(match, 'foo');
            t.equal(p1, 'fo');
            t.equal(p2, 'o');
            t.equal(offset, 1);
            t.equal(input, ' foo ');
            return p2 + '-' + p1
        })
        t.equal(newString, ' o-fo ');
        t.end();
    });

    t.test('messy global', async function(t) {
        var matches = ['foo', 'foz'];
        var offsets = [1, 5];
        var p2s = ['o', 'z'];
        const newString = await asyncReplace('1foo2foz3', /(fo)(.)/g, async function(match, p1, p2, offset, input) {
            t.equal(match, matches.shift());
            t.equal(p1, 'fo');
            t.equal(p2, p2s.shift());
            t.equal(offset, offsets.shift());
            t.equal(input, '1foo2foz3');
            return p2.toUpperCase() + p1
        });
        t.equal(newString, '1Ofo2Zfo3');
        t.end();
    });

    t.test('global and ignoreCase', async function(t) {
        const newString = await asyncReplace(' Foo foo ', /(f)oo/gi, async function(match, p1, offset, input) {
            return p1
        });
        t.equal(newString, ' F f ');
        t.end()
    });

    t.test('local and ignoreCase', async function(t) {
        const newString = await asyncReplace(' Foo foo ', /(f)oo/i, async function(match, p1, offset, input) {
            return p1
        });
        t.equal(newString, ' F foo ');
        t.end();
    });
    t.end();
});