var
    // Map over the SelectorGenerator in case of overwrite
    _SelectorGenerator = window.SelectorGenerator;

exports.noConflict = function () {
    if (window.SelectorGenerator === exports.SelectorGenerator) {
        window.SelectorGenerator = _SelectorGenerator;
    }

    return exports.SelectorGenerator;
};

