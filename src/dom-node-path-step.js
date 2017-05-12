/**
 * @constructor
 * @param {string} value
 * @param {boolean} optimized
 */
var DomNodePathStep = function (value, optimized) {
    this.value = value;
    this.optimized = optimized || false;
};

DomNodePathStep.prototype = {
    /**
     * @return {string}
     */
    toString: function () {
        return this.value;
    }
};

exports.DomNodePathStep = DomNodePathStep;
