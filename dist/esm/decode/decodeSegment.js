var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// import { decodeField } from './decodeField'
import { decodeRepSep } from './decodeRepSep';
import { findCharsFirstPos } from './findCharsFirstPos';
import { getEncodingChars } from './getEncodingChars';
export var decodeSegment = function (HL7, meta) {
    var _a;
    var name = (_a = HL7.match(new RegExp("^([A-Z][A-Z0-9]{2})"))) === null || _a === void 0 ? void 0 : _a[1];
    if (!name)
        throw Error("Expected segment name, got ".concat(HL7.slice(0, 20)));
    HL7 = HL7.slice(3);
    // console.log('HL7: ', HL7)
    var isMSH = false;
    if (name === 'MSH') {
        isMSH = true;
        meta.encodingCharacters = getEncodingChars(HL7.slice(0, 8));
        HL7 = HL7.slice(Object.keys(meta.encodingCharacters).length);
    }
    if (HL7.startsWith(meta.encodingCharacters.fieldSep)) {
        HL7 = HL7.slice(1);
    }
    var _b = decodeRepSep(HL7, meta.encodingCharacters.repetitionSep, meta.encodingCharacters.fieldSep, function (input, stopChars) {
        // console.log(input, stopChars)
        var i = findCharsFirstPos(input, stopChars);
        var _a = decodeRepSep(input.slice(0, i), undefined, meta.encodingCharacters.componentSep, function (input, stCh) {
            stCh.push.apply(stCh, stopChars);
            var i = findCharsFirstPos(input, stCh);
            var _a = decodeRepSep(input.slice(0, i), undefined, meta.encodingCharacters.subComponentSep, function (input, sc) {
                sc.push.apply(sc, stCh);
                var i = findCharsFirstPos(input, sc);
                return [input.slice(i), input.slice(0, i)];
            }), val = _a[1];
            input = input.slice(i);
            return [input, val];
        }), val = _a[1];
        input = input.slice(i);
        return [input, val];
    }), hl7 = _b[0], fields = _b[1];
    if (isMSH) {
        var _c = meta.encodingCharacters, fieldSep = _c.fieldSep, componentSep = _c.componentSep, repetitionSep = _c.repetitionSep, escapeChar = _c.escapeChar, subComponentSep = _c.subComponentSep, subCompRepSep = _c.subCompRepSep;
        if (!Array.isArray(fields))
            throw Error('Expected array of fields');
        fields === null || fields === void 0 ? void 0 : fields.unshift(fieldSep, "".concat(componentSep).concat(repetitionSep).concat(escapeChar).concat(subComponentSep).concat(subCompRepSep ? subCompRepSep : ''));
    }
    if (hl7)
        console.log('Not Fully Decoded: ', hl7);
    if (fields === null || fields === undefined)
        return [name];
    if (Array.isArray(fields))
        return __spreadArray([name], fields, true);
    return [name, fields];
};
