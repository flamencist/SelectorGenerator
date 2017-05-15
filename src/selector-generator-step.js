/* globals DomNodePathStep, cssEscaper */ //eslint-disable-line no-unused-vars
/**
 * @param {Object?} options
 * @param {boolean?} options.withoutNthChild
 * @param {boolean?} options.optimized
 * @param {Node?} options.targetNode
 * @class
 * @constructor
 */
function SelectorGeneratorStep(options) {
    options = options || {
            withoutNthChild: false,
            targetNode: null,
            optimized: false
        };

    /**
     * generate selector for current node
     * @param {HTMLElement} node
     * @return {DomNodePathStep} selector for current node
     */
    this.visit = function (node) {
        if (node.nodeType !== 1) {
            return null;
        }

        //region get step with id
        var id = node.getAttribute("id");
        if (options.optimized) {
            if (id) {
                return new DomNodePathStep(idSelector(id), true);
            }
            var nodeNameLower = node.nodeName.toLowerCase();
            if (nodeNameLower === "body" || nodeNameLower === "head" || nodeNameLower === "html") {
                return new DomNodePathStep(node.nodeName.toLowerCase(), true);
            }
        }
        var nodeName = node.nodeName.toLowerCase();
        var parent = node.parentNode;
        var siblings = parent.children || [];

        if (id && !hasSiblingsWithId(siblings, id, nodeName)) {
            return new DomNodePathStep(nodeName + idSelector(id), true);
        }
        //endregion

        //region return nodeName if not parent
        if (!parent || parent.nodeType === 9) // document node
        {
            return new DomNodePathStep(nodeName, true);
        }
        //endregion

        var siblingsWithSameNodeName = getSiblingsWithSameNodeName(node, siblings);
        var needsAttributeName = hasUniqueAttributeName(node,siblingsWithSameNodeName);
        var needsClassNames = siblingsWithSameNodeName.length > 0;
        var needsNthChild = isNeedsNthChild(node, siblingsWithSameNodeName, needsAttributeName);
        var needsType = hasType(node);

        var result = nodeName;

        if (needsAttributeName) {
            var attributeName = node.getAttribute("name");
            result += "[name=\"" + cssEscaper.escape(attributeName) + "\"]";
            return new DomNodePathStep(result, true);
        }

        if (needsType) {
            result += "[type=\"" + node.getAttribute("type") + "\"]";
        }

        if (needsNthChild && !options.withoutNthChild) {
            var ownIndex = _.indexOf(siblings, node);
            result += ":nth-child(" + (ownIndex + 1) + ")";
        } else if (needsClassNames) {
            var prefixedOwnClassNamesArray = prefixedElementClassNames(node);
            for (var prefixedName in keySet(prefixedOwnClassNamesArray)) { //eslint-disable-line guard-for-in
                result += "." + cssEscaper.escape(prefixedName.substr(1));
            }
        }

        return new DomNodePathStep(result, false);
    };

    function hasUniqueAttributeName(node, siblingsWithSameNodeName){
        var attributeName = node.getAttribute("name");
        var isSimpleFormElement = isSimpleInput(node, options.targetNode === node) || isFormWithoutId(node);
        return !!(isSimpleFormElement && attributeName && !_.find(siblingsWithSameNodeName,function(sibling){
            return sibling.getAttribute("name") === attributeName;
        }));
    }

    function isNeedsNthChild(node, siblings, isUniqueAttributeName) {
        var needsNthChild = false;
        var prefixedOwnClassNamesArray = prefixedElementClassNames(node);
        for (var i = 0; (!needsNthChild) && i < siblings.length; ++i) {
            var sibling = siblings[i];
            if (needsNthChild) {
                continue;
            }

            var ownClassNames = keySet(prefixedOwnClassNamesArray);
            var ownClassNameCount = 0;

            for (var name in ownClassNames) {
                if (ownClassNames.hasOwnProperty(name)) {
                    ++ownClassNameCount;
                }
            }
            if (ownClassNameCount === 0 && !isUniqueAttributeName) {
                needsNthChild = true;
                continue;
            }
            var siblingClassNamesArray = prefixedElementClassNames(sibling);

            for (var j = 0; j < siblingClassNamesArray.length; ++j) {
                var siblingClass = siblingClassNamesArray[j];
                if (!ownClassNames.hasOwnProperty(siblingClass)) {
                    continue;
                }
                delete ownClassNames[siblingClass];
                if (!--ownClassNameCount && !isUniqueAttributeName) {
                    needsNthChild = true;
                    break;
                }
            }
        }
        return needsNthChild;
    }

    function getSiblingsWithSameNodeName(node, siblings) {
        return _.filter(siblings, function (sibling) {
            return sibling.nodeType === 1 && sibling !== node && sibling.nodeName.toLowerCase() === node.nodeName.toLowerCase();
        });
    }

    function hasType(node) {
        return node.getAttribute("type") && (isSimpleInput(node, options.targetNode === node) || isFormWithoutId(node));
    }

    /**
     * @function idSelector
     * @param {string} id
     * @return {string}
     */
    function idSelector(id) {
        return "#" + cssEscaper.escape(id);
    }

    /**
     * element has siblings with same id and same tag
     * @function hasSiblingsWithId
     * @param {Array} siblings Array of elements , parent.children
     * @param {String} id
     * @param {String} nodeName
     * @return {boolean}
     */
    function hasSiblingsWithId(siblings, id, nodeName) {
        return _.filter(siblings, function (el) {
                return el.nodeType === 1 && el.getAttribute("id") === id && el.nodeName.toLowerCase() === nodeName;
            }).length !== 1;
    }

    /**
     * @function keySet
     * @param {Array} array of keys
     * @return {Object}
     */
    function keySet(array) {
        var keys = {};
        for (var i = 0; i < array.length; ++i) {
            keys[array[i]] = true;
        }
        return keys;
    }

    /**
     * @function prefixedElementClassNames
     * @param {HTMLElement} node
     * @return {!Array.<string>}
     */
    function prefixedElementClassNames(node) {
        var classAttribute = getClassName(node);
        if (!classAttribute) {
            return [];
        }

        var classes = classAttribute.split(/\s+/g);
        var existClasses = _.filter(classes, Boolean);
        return _.map(existClasses, function (name) {
            // The prefix is required to store "__proto__" in a object-based map.
            return "$" + name;
        });
    }

    function isFormWithoutId(node) {
        return node.nodeName.toLowerCase() === "form" && !node.getAttribute("id");
    }

    /**
     * target is simple input without classes,id
     * @function isSimpleInput
     * @param node
     * @param isTargetNode
     * @return {boolean}
     */
    function isSimpleInput(node, isTargetNode) {
        return isTargetNode && node.nodeName.toLowerCase() === "input" && !node.getAttribute("id") && !getClassName(node);
    }

    /**
     * @function getClassName
     * get css class of element
     * @param {HTMLElement} node Web element
     * @return {string}
     */
    function getClassName(node) {
        return node.getAttribute("class") || node.className;
    }

}

exports.SelectorGeneratorStep = SelectorGeneratorStep;
