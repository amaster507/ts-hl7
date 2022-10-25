export var getEncodingChars = function (HL7) {
    return {
        fieldSep: HL7.slice(0, 1),
        componentSep: HL7.slice(1, 2),
        repetitionSep: HL7.slice(2, 3),
        escapeChar: HL7.slice(3, 4),
        subComponentSep: HL7.slice(4, 5),
        subCompRepSep: HL7.slice(0, 1) === HL7.slice(5, 6) ? undefined : HL7.slice(5, 6),
    };
};
