"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeHL7 = void 0;
var decodeSegment_1 = require("./decodeSegment");
var getEncodingChars_1 = require("./getEncodingChars");
var decodeHL7 = function (HL7, encoding) {
    if (encoding === void 0) { encoding = undefined; }
    if (HL7.length === 0) {
        return undefined;
    }
    // if (!HL7.startsWith('MSH')) {
    //   throw Error(`Expected MSH segment, got ${HL7.slice(0, 3)}`)
    // }
    var encodingCharacters = encoding !== undefined
        ? encoding
        : HL7.startsWith('MSH')
            ? (0, getEncodingChars_1.getEncodingChars)(HL7)
            : {
                componentSep: '^',
                escapeChar: '\\',
                fieldSep: '|',
                repetitionSep: '~',
                subComponentSep: '&',
                subCompRepSep: undefined,
            };
    var meta = {
        encodingCharacters: encodingCharacters,
    };
    var segments = HL7.split(/\r?\n/)
        .filter(function (s) { return s.length; })
        .map(function (segment) {
        return (0, decodeSegment_1.decodeSegment)(segment, meta);
    });
    return [meta, segments];
};
exports.decodeHL7 = decodeHL7;
