var shim = {};
//noinspection JSUnresolvedVariable
var call = Function.call;

/**
 * wrap function and use first argument as context (this) in returned function
 * @param f {Function} function for call
 * @returns {Function}
 */
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}

/**
 * check function is native
 * @param f {Function} function
 * @returns {boolean}
 */
var isFuncNative = function (f) {
    return !!f && (typeof f).toLowerCase() === "function"
        && (f === Function.prototype
        || /^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*\{\s*\[native code\]\s*\}\s*$/i.test(String(f)));
};

var array_reduce = uncurryThis(
    Array.prototype.reduce && isFuncNative(Array.prototype.reduce) ? Array.prototype.reduce : function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_map = uncurryThis(
    Array.prototype.map && isFuncNative(Array.prototype.map) ? Array.prototype.map : function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var array_filter = uncurryThis(
    Array.prototype.filter && isFuncNative(Array.prototype.filter) ? Array.prototype.filter :
        function (predicate, that) {
            var other = [], v;
            for (var i = 0, n = this.length; i < n; i++) {
                if (i in this && predicate.call(that, v = this[i], i, this)) {
                    other.push(v);
                }
            }
            return other;
        }
);

shim.reduce = array_reduce;
shim.map = array_map;
shim.filter = array_filter;

var _ = shim; //eslint-disable-line no-unused-vars
exports._  = shim;