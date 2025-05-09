/**
 *  When sending values to or receiving values from a [[Contract]], the
 *  data is generally encoded using the [ABI standard](link-solc-abi).
 *
 *  The AbiCoder provides a utility to encode values to ABI data and
 *  decode values from ABI data.
 *
 *  Most of the time, developers should favour the [[Contract]] class,
 *  which further abstracts a lot of the finer details of ABI data.
 *
 *  @_section api/abi/abi-coder:ABI Encoding
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AbiCoder_instances, _AbiCoder_getCoder;
// See: https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI
import { assertArgumentCount, assertArgument } from "./utils/index.js";
import { Reader, Writer } from "./coders/abstract-coder.js";
import { AddressCoder } from "./coders/address.js";
import { ArrayCoder } from "./coders/array.js";
import { BooleanCoder } from "./coders/boolean.js";
import { BytesCoder } from "./coders/bytes.js";
import { FixedBytesCoder } from "./coders/fixed-bytes.js";
import { NullCoder } from "./coders/null.js";
import { NumberCoder } from "./coders/number.js";
import { StringCoder } from "./coders/string.js";
import { TupleCoder } from "./coders/tuple.js";
import { ParamType } from "./fragments.js";
// https://docs.soliditylang.org/en/v0.8.17/control-structures.html
const PanicReasons = new Map();
PanicReasons.set(0x00, "GENERIC_PANIC");
PanicReasons.set(0x01, "ASSERT_FALSE");
PanicReasons.set(0x11, "OVERFLOW");
PanicReasons.set(0x12, "DIVIDE_BY_ZERO");
PanicReasons.set(0x21, "ENUM_RANGE_ERROR");
PanicReasons.set(0x22, "BAD_STORAGE_DATA");
PanicReasons.set(0x31, "STACK_UNDERFLOW");
PanicReasons.set(0x32, "ARRAY_RANGE_ERROR");
PanicReasons.set(0x41, "OUT_OF_MEMORY");
PanicReasons.set(0x51, "UNINITIALIZED_FUNCTION_CALL");
const paramTypeBytes = new RegExp(/^bytes([0-9]*)$/);
const paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);
let defaultCoder = null;
let defaultMaxInflation = 1024;
/**
 *  The **AbiCoder** is a low-level class responsible for encoding JavaScript
 *  values into binary data and decoding binary data into JavaScript values.
 */
export class AbiCoder {
    constructor() {
        _AbiCoder_instances.add(this);
    }
    /**
     *  Get the default values for the given %%types%%.
     *
     *  For example, a ``uint`` is by default ``0`` and ``bool``
     *  is by default ``false``.
     */
    getDefaultValue(types) {
        const coders = types.map((type) => __classPrivateFieldGet(this, _AbiCoder_instances, "m", _AbiCoder_getCoder).call(this, ParamType.from(type)));
        const coder = new TupleCoder(coders, "_");
        return coder.defaultValue();
    }
    /**
     *  Encode the %%values%% as the %%types%% into ABI data.
     *
     *  @returns DataHexstring
     */
    encode(types, values) {
        assertArgumentCount(values.length, types.length, "types/values length mismatch");
        const coders = types.map((type) => __classPrivateFieldGet(this, _AbiCoder_instances, "m", _AbiCoder_getCoder).call(this, ParamType.from(type)));
        const coder = (new TupleCoder(coders, "_"));
        const writer = new Writer();
        coder.encode(writer, values);
        return writer.data;
    }
    /**
     *  Decode the ABI %%data%% as the %%types%% into values.
     *
     *  If %%loose%% decoding is enabled, then strict padding is
     *  not enforced. Some older versions of Solidity incorrectly
     *  padded event data emitted from ``external`` functions.
     */
    decode(types, data, loose) {
        const coders = types.map((type) => __classPrivateFieldGet(this, _AbiCoder_instances, "m", _AbiCoder_getCoder).call(this, ParamType.from(type)));
        const coder = new TupleCoder(coders, "_");
        return coder.decode(new Reader(data, loose, defaultMaxInflation));
    }
    static _setDefaultMaxInflation(value) {
        assertArgument(typeof (value) === "number" && Number.isInteger(value), "invalid defaultMaxInflation factor", "value", value);
        defaultMaxInflation = value;
    }
    /**
     *  Returns the shared singleton instance of a default [[AbiCoder]].
     *
     *  On the first call, the instance is created internally.
     */
    static defaultAbiCoder() {
        if (defaultCoder == null) {
            defaultCoder = new AbiCoder();
        }
        return defaultCoder;
    }
}
_AbiCoder_instances = new WeakSet(), _AbiCoder_getCoder = function _AbiCoder_getCoder(param) {
    if (param.isArray()) {
        return new ArrayCoder(__classPrivateFieldGet(this, _AbiCoder_instances, "m", _AbiCoder_getCoder).call(this, param.arrayChildren), param.arrayLength, param.name);
    }
    if (param.isTuple()) {
        return new TupleCoder(param.components.map((c) => __classPrivateFieldGet(this, _AbiCoder_instances, "m", _AbiCoder_getCoder).call(this, c)), param.name);
    }
    switch (param.baseType) {
        case "address":
            return new AddressCoder(param.name);
        case "bool":
            return new BooleanCoder(param.name);
        case "string":
            return new StringCoder(param.name);
        case "bytes":
            return new BytesCoder(param.name);
        case "":
            return new NullCoder(param.name);
    }
    // u?int[0-9]*
    let match = param.type.match(paramTypeNumber);
    if (match) {
        let size = parseInt(match[2] || "256");
        assertArgument(size !== 0 && size <= 256 && (size % 8) === 0, "invalid " + match[1] + " bit length", "param", param);
        return new NumberCoder(size / 8, (match[1] === "int"), param.name);
    }
    // bytes[0-9]+
    match = param.type.match(paramTypeBytes);
    if (match) {
        let size = parseInt(match[1]);
        assertArgument(size !== 0 && size <= 32, "invalid bytes length", "param", param);
        return new FixedBytesCoder(size, param.name);
    }
    assertArgument(false, "invalid type", "type", param.type);
};
