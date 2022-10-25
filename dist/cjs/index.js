"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Msg = void 0;
var getSegment_1 = require("./class/getSegment");
var decode_1 = __importDefault(require("./decode"));
var encode_1 = __importDefault(require("./encode"));
/** MESSAGE
 * A message is the atomic unit of data transferred between systems. It is comprised of a group of segments in a defined sequence. Each message has a message type that defines its purpose. For example the ADT Message type is used to transmit portions of a patient's Patient Administration (ADT) data from one system to another. A three-character code contained within each message identifies its type. These are listed in the Message Type list, Appendix A.
 * The real-world event that initiates an exchange of messages is called a trigger event. See Section 2.3.1, "Trigger events," for a more detailed description of trigger events. Refer to HL7 Table 0003 - Event type for a listing of all defined trigger events. These codes represent values such as A patient is admitted or An order event occurred. There is a one-to-many relationship between message types and trigger event codes. The same trigger event code may not be associated with more than one message type; however a message type may be associated with more than one trigger event code.
 * All message types and trigger event codes beginning with the letter "Z" are reserved for locally defined messages. No such codes will be defined within the HL7 Standard.
 *
 * @see http://www.hl7.eu/HL7v2x/v251/std251/ch02.html#Heading11
 */
var Msg = /** @class */ (function () {
    function Msg(msg) {
        var _this = this;
        var _a;
        this._msg = [
            {
                encodingCharacters: {
                    fieldSep: '|',
                    componentSep: '^',
                    subComponentSep: '&',
                    repetitionSep: '~',
                    escapeChar: '\\',
                },
            },
            [['MSH', '|', '^~\\&']],
        ];
        this.addSegment = function (segment) {
            var _a;
            if (typeof segment === 'string') {
                var seg = (0, decode_1.default)(segment);
                if (seg === undefined) {
                    return false;
                }
                (_a = _this.msg[1]).push.apply(_a, seg[1]);
                return _this.msg;
            }
            else if (segment.length > 0) {
                _this.msg[1].push(segment);
                return _this.msg;
            }
            return false;
        };
        this.toString = function () {
            return (0, encode_1.default)(_this.msg);
        };
        this.get = function (path) {
            if (path === undefined)
                return _this.msg;
            var segRx = '([A-Z][A-Z0-9]{2})';
            var repRx = '(?:\\[([0-9]+)\\])';
            var posRx = '(?:[-\\.]([0-9]+))';
            var pathRx = new RegExp("^(?:".concat(segRx, ")").concat(repRx, "?(?:").concat(posRx).concat(repRx, "?(?:").concat(posRx).concat(posRx, "?)?)?$"));
            var paths = path.match(pathRx);
            var _a = paths !== null && paths !== void 0 ? paths : [], segmentName = _a[1], segmentIteration = _a[2], fieldPosition = _a[3], fieldIteration = _a[4], componentPosition = _a[5], subComponentPosition = _a[6];
            return _this._get(segmentName, segmentIteration === undefined ? undefined : parseInt(segmentIteration), fieldPosition === undefined ? undefined : parseInt(fieldPosition), fieldIteration === undefined ? undefined : parseInt(fieldIteration), componentPosition === undefined ? undefined : parseInt(componentPosition), subComponentPosition === undefined
                ? undefined
                : parseInt(subComponentPosition));
        };
        this._get = function (segmentName, segmentIteration, fieldPosition, fieldIteration, componentPosition, subComponentPosition) {
            var ret = (0, getSegment_1.getSegment)(_this.msg, segmentName)
                .filter(function (_seg, i) {
                if (segmentIteration === undefined)
                    return true;
                return i === segmentIteration - 1;
            })
                .map(function (seg) {
                if (fieldPosition === undefined)
                    return seg;
                return seg === null || seg === void 0 ? void 0 : seg[fieldPosition];
            })
                .map(function (field) {
                var _a;
                if (Array.isArray(field) &&
                    field.length > 1 &&
                    typeof field[0] === 'object' &&
                    ((_a = field[0]) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('rep'))) {
                    var f = [];
                    if (fieldIteration === undefined) {
                        f = __spreadArray([], field, true);
                        f.shift();
                    }
                    else if (Array.isArray(field) && fieldIteration > 0) {
                        f = field.filter(function (f, i) {
                            if (fieldIteration === undefined)
                                return true;
                            return i === fieldIteration;
                        });
                    }
                    if (componentPosition !== undefined && componentPosition > 0) {
                        f = f
                            .map(function (comp) { return comp === null || comp === void 0 ? void 0 : comp[componentPosition - 1]; })
                            .map(function (comp) {
                            if (!Array.isArray(comp) ||
                                subComponentPosition === undefined ||
                                subComponentPosition < 1)
                                return comp;
                            return comp === null || comp === void 0 ? void 0 : comp[subComponentPosition - 1];
                        });
                    }
                    if (Array.isArray(f) && f.length === 1) {
                        return f[0];
                    }
                    return f;
                }
                if (Array.isArray(field)) {
                    if (componentPosition === undefined || componentPosition < 1)
                        return field;
                    var comp = field === null || field === void 0 ? void 0 : field[componentPosition - 1];
                    if (!Array.isArray(comp) ||
                        subComponentPosition === undefined ||
                        subComponentPosition < 1)
                        return comp;
                    return comp === null || comp === void 0 ? void 0 : comp[subComponentPosition - 1];
                }
                return field;
            });
            if (ret.length === 1)
                return ret[0];
            return ret;
        };
        if (typeof msg === 'string') {
            this.msg = (_a = (0, decode_1.default)(msg)) !== null && _a !== void 0 ? _a : this._msg;
        }
        else if (msg !== undefined) {
            this.msg = msg;
        }
        else {
            this.msg = this._msg;
        }
    }
    return Msg;
}());
exports.Msg = Msg;
exports.default = Msg;
