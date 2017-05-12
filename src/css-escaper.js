var cssEscaper = (function(){
    /**
     * @function escapeIdentifierIfNeeded
     * @param {string} ident
     * @return {string}
     */
    function escapeIdentifierIfNeeded(ident) {
        if (isCssIdentifier(ident)) {
            return ident;
        }
        var shouldEscapeFirst = /^(?:[0-9]|-[0-9-]?)/.test(ident);
        var lastIndex = ident.length - 1;
        return ident.replace(/./g, function (c, i) {
            return ((shouldEscapeFirst && i === 0) || !isCssIdentChar(c)) ? escapeAsciiChar(c, i === lastIndex) : c;
        });
    }

    /**
     * @function escapeAsciiChar
     * @param {string} c
     * @param {boolean} isLast
     * @return {string}
     */
    function escapeAsciiChar(c, isLast) {
        return "\\" + toHexByte(c) + (isLast ? "" : " ");
    }

    /**
     * @function toHexByte
     * @param {string} c
     */
    function toHexByte(c) {
        var hexByte = c.charCodeAt(0).toString(16);
        if (hexByte.length === 1) {
            hexByte = "0" + hexByte;
        }
        return hexByte;
    }

    /**
     * @function isCssIdentChar
     * @param {string} c
     * @return {boolean}
     */
    function isCssIdentChar(c) {
        if (/[a-zA-Z0-9_-]/.test(c)) {
            return true;
        }
        return c.charCodeAt(0) >= 0xA0;
    }

    /**
     * @function isCssIdentifier
     * @param {string} value
     * @return {boolean}
     */
    function isCssIdentifier(value) {
        return /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value);
    }

    return {escape : escapeIdentifierIfNeeded};

})();

exports.cssEscaper = cssEscaper;
