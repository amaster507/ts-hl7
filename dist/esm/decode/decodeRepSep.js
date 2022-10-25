export var decodeRepSep = function (input, rep, sep, callback) {
    var noRep = false;
    if (rep === undefined) {
        rep = '';
        noRep = true;
    }
    if (input.length === 0)
        return [input, null];
    input = sep + input;
    var seps = [];
    while (input.startsWith(sep)) {
        input = rep + input.slice(1);
        var reps = [];
        while (noRep || input.startsWith(rep)) {
            if (!noRep)
                input = input.slice(1);
            var _a = callback(input, [sep, rep]), remaining = _a[0], val = _a[1];
            input = remaining;
            reps.push(val);
            // console.log({ rep, input, val })
            if (noRep)
                break;
        }
        if (reps.length === 0) {
            seps.push(undefined);
        }
        else if (reps.length === 1) {
            seps.push(reps[0]);
        }
        else {
            reps.unshift({ rep: true });
            seps.push(reps);
        }
    }
    if (seps.length === 0) {
        return [input, undefined];
    }
    else if (seps.length === 1 && typeof seps[0] == 'string') {
        return [input, seps[0]];
    }
    return [input, seps];
};
