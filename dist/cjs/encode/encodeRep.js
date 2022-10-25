"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeRep = void 0;
var encodeRep = function (msg, rep, map) {
    var _a;
    if (map === void 0) { map = function (m) { return m; }; }
    if (!Array.isArray(msg) || msg === undefined || msg === null) {
        return map(msg);
    }
    if (typeof (msg === null || msg === void 0 ? void 0 : msg[0]) === 'object' && ((_a = msg === null || msg === void 0 ? void 0 : msg[0]) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('rep'))) {
        msg.shift();
        return msg.map(map).join(rep);
    }
    return map(msg);
};
exports.encodeRep = encodeRep;
