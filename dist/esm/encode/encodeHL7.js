import { encodeRep } from './encodeRep';
import { encodeSep } from './encodeSep';
export var encodeHL7 = function (message) {
    var _a = message[0].encodingCharacters, fieldSep = _a.fieldSep, repetitionSep = _a.repetitionSep, componentSep = _a.componentSep, subComponentSep = _a.subComponentSep;
    var segments = message[1];
    var hl7 = encodeSep(segments, '\n', function (seg) {
        if (Array.isArray(seg)) {
            if (seg[0] === 'MSH') {
                var name_1 = seg[0];
                var fieldSep_1 = (seg === null || seg === void 0 ? void 0 : seg[1]) || '|';
                var encodingChars = seg[2] || '^~\\&';
                seg.splice(0, 3, "".concat(name_1).concat(fieldSep_1).concat(encodingChars));
            }
        }
        return encodeSep(seg, fieldSep, function (field) {
            return encodeRep(field, repetitionSep, function (rep) {
                return encodeSep(rep, componentSep, function (comp) {
                    return encodeSep(comp, subComponentSep, function (sub) {
                        return sub;
                    });
                });
            });
        });
    });
    return hl7;
};
