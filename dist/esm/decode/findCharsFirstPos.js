export var findCharsFirstPos = function (input, chars) {
    return Math.min.apply(Math, chars
        .filter(function (c) {
        if (c.length > 1)
            throw new Error('stop character is too long, expected 1 character');
        return c.length > 0;
    })
        .map(function (c) { return input.indexOf(c); })
        .filter(function (i) { return i !== -1; }));
};
