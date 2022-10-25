import { decodeSegment } from './decodeSegment';
import { getEncodingChars } from './getEncodingChars';
export var decodeHL7 = function (HL7, encoding) {
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
            ? getEncodingChars(HL7)
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
        return decodeSegment(segment, meta);
    });
    return [meta, segments];
};
