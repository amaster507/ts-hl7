export var getSegment = function (msg, segmentName) {
    if (segmentName === undefined)
        return msg[1];
    if (segmentName.match(/^[A-Z0-9]{3}$/) === null)
        throw new Error("Expected segment name to be 3 characters long, got ".concat(segmentName));
    return msg[1].filter(function (s) { return s[0] === segmentName; });
};
