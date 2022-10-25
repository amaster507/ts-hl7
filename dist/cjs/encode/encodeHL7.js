"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeHL7 = void 0;
var encodeRep_1 = require("./encodeRep");
var encodeSep_1 = require("./encodeSep");
var encodeHL7 = function (message) {
    var _a = message[0].encodingCharacters, fieldSep = _a.fieldSep, repetitionSep = _a.repetitionSep, componentSep = _a.componentSep, subComponentSep = _a.subComponentSep;
    var segments = message[1];
    var hl7 = (0, encodeSep_1.encodeSep)(segments, '\n', function (seg) {
        if (Array.isArray(seg)) {
            if (seg[0] === 'MSH') {
                var name_1 = seg[0];
                var fieldSep_1 = (seg === null || seg === void 0 ? void 0 : seg[1]) || '|';
                var encodingChars = seg[2] || '^~\\&';
                seg.splice(0, 3, "".concat(name_1).concat(fieldSep_1).concat(encodingChars));
            }
        }
        return (0, encodeSep_1.encodeSep)(seg, fieldSep, function (field) {
            return (0, encodeRep_1.encodeRep)(field, repetitionSep, function (rep) {
                return (0, encodeSep_1.encodeSep)(rep, componentSep, function (comp) {
                    return (0, encodeSep_1.encodeSep)(comp, subComponentSep, function (sub) {
                        return sub;
                    });
                });
            });
        });
    });
    return hl7;
};
exports.encodeHL7 = encodeHL7;
