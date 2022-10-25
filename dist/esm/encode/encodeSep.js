export var encodeSep = function (msg, sep, map) {
    if (map === void 0) { map = function (m) { return m; }; }
    if (!Array.isArray(msg))
        return msg;
    return msg.map(map).join(sep);
};
