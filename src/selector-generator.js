/*global DomNodePathStep, cssEscaper*///eslint-disable-line no-unused-vars
/**
 * @class
 * get unique selector, path of node
 * @param {Object?} options
 * @param {function?} options.querySelectorAll
 * @constructor
 */
function SelectorGenerator (options) { //eslint-disable-line no-unused-vars

    options = options || {};

    /**
     * @description get full path of node
     * @function getPath
     * @param {HTMLElement} node
     * @return {string}
     */
    function getPath(node) {
        if (!node || node.nodeType !== 1) {
            return "";
        }
        var steps = [];
        var contextNode = node;
        while (contextNode) {
            var step = cssPathStep(contextNode, false, contextNode === node, true);
            if (!step) {
                break;
            } // Error - bail out early.
            steps.push(step);
            contextNode = contextNode.parentNode;
        }

        steps.reverse();
        return steps.join(" ");
    }

    /**
     * @param {HTMLElement} node
     * @param {boolean?} optimized
     * @return {string}
     */
    function getSelector(node, optimized) {
        if (!node || node.nodeType !== 1) {
            return "";
        }

        var steps = [];
        var contextNode = node;
        while (contextNode) {
            var step = cssPathStep(contextNode, !!optimized, contextNode === node, false);
            if (!step) {
                break; // Error - bail out early.
            }
            steps.push(step);
            if (step.optimized) {
                if (isUniqueSelector(buildSelector(steps))) {
                    break;
                }
            }
            contextNode = contextNode.parentNode;
        }

        var simplifiedSteps = simplifySelector(steps);
        return buildSelector(simplifiedSteps);
    }

    /**
     * @param {HTMLElement} node
     * @param {boolean?} optimized
     * @param {boolean?} isTargetNode
     * @param {boolean?} withoutNthChild
     * @return {DomNodePathStep} selector for current node
     */
    function cssPathStep(node, optimized, isTargetNode, withoutNthChild) {
        if (node.nodeType !== 1) {
            return null;
        }

        var id = node.getAttribute("id");
        if (optimized) {
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

        if (!parent || parent.nodeType === 9) // document node
        {
            return new DomNodePathStep(nodeName, true);
        }

        var prefixedOwnClassNamesArray = prefixedElementClassNames(node);
        var needsClassNames = false;
        var needsNthChild = false;
        var ownIndex = -1;
        var elementIndex = -1;

        var attributeName = node.getAttribute("name");
        var isSimpleFormElement = isSimpleInput(node, isTargetNode) || isFormWithoutId(node);
        var attributeNameNeeded = !!(isSimpleFormElement && attributeName);

        for (var i = 0;
             (ownIndex === -1 || !needsNthChild) && i < siblings.length; ++i) {
            var sibling = siblings[i];
            if (sibling.nodeType !== 1) {
                continue;
            }
            elementIndex += 1;
            if (sibling === node) {
                ownIndex = elementIndex;
                continue;
            }
            if (needsNthChild) {
                continue;
            }
            if (sibling.nodeName.toLowerCase() !== nodeName) {
                continue;
            }

            needsClassNames = true;
            var ownClassNames = keySet(prefixedOwnClassNamesArray);
            var ownClassNameCount = 0;
            var siblingAttributeName = sibling.getAttribute("name");
            if (siblingAttributeName === attributeName) {
                attributeNameNeeded = false;
            }

            for (var name in ownClassNames) {
                if (ownClassNames.hasOwnProperty(name)) {
                    ++ownClassNameCount;
                }
            }
            if (ownClassNameCount === 0 && !attributeNameNeeded) {
                needsNthChild = !withoutNthChild;
                continue;
            }
            var siblingClassNamesArray = prefixedElementClassNames(sibling);

            for (var j = 0; j < siblingClassNamesArray.length; ++j) {
                var siblingClass = siblingClassNamesArray[j];
                if (!ownClassNames.hasOwnProperty(siblingClass)) {
                    continue;
                }
                delete ownClassNames[siblingClass];
                if (!--ownClassNameCount && !attributeNameNeeded) {
                    needsNthChild = !withoutNthChild;
                    break;
                }
            }
        }

        var result = nodeName;
        if (isSimpleFormElement && attributeNameNeeded) {
            result += "[name=\"" + cssEscaper.escape(attributeName) + "\"]";
            return new DomNodePathStep(result, true);

        } else if (isSimpleFormElement && node.getAttribute("type")) {
            result += "[type=\"" + node.getAttribute("type") + "\"]";
        }

        if (needsNthChild) {
            result += ":nth-child(" + (ownIndex + 1) + ")";
        } else if (needsClassNames) {
            for (var prefixedName in keySet(prefixedOwnClassNamesArray)) { //eslint-disable-line guard-for-in
                result += "." + cssEscaper.escape(prefixedName.substr(1));
            }
        }

        return new DomNodePathStep(result, false);
    }

    /**
     * simplify selector
     * @example
     * ```
     *  <div>
     *      <div>
     *          <form>
     *              <input type="text"/>
     *          </form>
     *      </div>
     *  </div>
     *
     * var steps = [new DomNodePathStep("input[type='text']"), new DomNodePathStep("form"), new DomNodePathStep("div"), new DomNodePathStep("div")];
     * var simplified = simplifySelector(steps); // ["input[type='text']", "form"]
     * ```
     *
     * @example
     * ```
     *  <div id="loginForm">
     *      <div>
     *          <div>
     *              <input type="text"/>
     *          </div>
     *      </div>
     *  </div>
     *
     * var steps = [new DomNodePathStep("input[type='text']"), new DomNodePathStep("div"), new DomNodePathStep("div"), new DomNodePathStep("div#loginForm")];
     * var simplified = simplifySelector(steps); // [["input[type='text']"],["div#loginForm"]]
     * ```
     *
     * @method simplifySelector
     * @param {Array} steps parts of selector
     * @return {Array} steps array of steps or array Arrays of steps
     */
    function simplifySelector(steps) {
        var minLength = 2;
        //if count of selectors is little, that not modify selector
        if (steps.length <= minLength) {
            return steps;
        }

        var stepsCopy = steps.slice();
        removeHtmlBodySteps(stepsCopy);

        var lastStep = stepsCopy[stepsCopy.length - 1];
        var parentWithId = lastStep.toString().indexOf("#") >= 0;
        var parentWithName = lastStep.toString().indexOf("name=") >= 0;

        if (parentWithId || parentWithName) {
            return simplifyStepsWithParent(stepsCopy);
        } else {
            return regularSimplifySteps(stepsCopy, minLength);
        }
    }

    /**
     * remove Html, Body Steps
     * @param steps
     */
    function removeHtmlBodySteps(steps) {
        while (steps[steps.length - 1].toString() === "html" || steps[steps.length - 1].toString() === "body") {
            steps.pop();
        }
    }

    /**
     *  simplifyStepsWithParent
     * @function simplifyStepsWithParent
     * @param steps
     * @return {Array} array of arrays
     */
    function simplifyStepsWithParent(steps) {
        var parentStep = steps.slice(-1);
        var sliced = steps.slice(0, 1);
        while (sliced.length < (steps.length - 1)) {
            var selector = buildSelector([sliced, parentStep]);
            if (isUniqueSelector(selector)) {
                break;
            }
            sliced = steps.slice(0, sliced.length + 1);
        }
        return [sliced, parentStep];
    }

    /**
     * regularSimplifySteps
     * @method regularSimplifySteps
     * @param {Array} steps
     * @param {int=2} minLength
     * @return {Array} array of steps
     */
    function regularSimplifySteps(steps, minLength) {
        minLength = minLength || 2;
        var sliced = steps.slice(0, minLength);
        while (sliced.length < steps.length) {
            var selector = buildSelector(sliced);
            if (isUniqueSelector(selector)) {
                break;
            }
            sliced = steps.slice(0, sliced.length + 1);
        }
        return sliced;
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

    function isFormWithoutId(node) {
        return node.nodeName.toLowerCase() === "form" && !node.getAttribute("id");
    }


    /**
     * create selector string from steps array
     * @function buildSelector
     * @example
     * with single array of steps
     * ```
     * <form id="loginForm">
     *    <input type='text'/>
     * </form>
     *
     *  var steps = [new DomNodePathStep("input[type='text']"),new DomNodePathStep("form#loginForm")];
     *  var selector = buildSelector(steps); // "form#loginForm > input[type='text']"
     * ```
     *
     * @example
     * with multiple array of steps
     * ```
     * <div id="loginForm">
     *    <div>
     *       <div>
     *          <input type='text'/>
     *      </div>
     *   </div>
     *  </div>
     *
     * var steps = [[new DomNodePathStep("input[type='text']")],[new DomNodePathStep("div#loginForm")]];
     * var selector = buildSelector(steps); // "div#loginForm input[type='text']"
     * ```
     *
     * @param {Array} steps Array of string or array of Array of string
     * @return {string} selector string
     */
    function buildSelector(steps) {
        var stepsCopy = steps.slice();
        stepsCopy.reverse();
        //check steps is regular array of steps
        if (typeof(stepsCopy[0].value) !== "undefined") {
            return stepsCopy.join(" > ");
        } else {
            return _.reduce(stepsCopy, function (previosValue, currentValue) {
                var selector = buildSelector(currentValue);
                return previosValue ? previosValue + " " + selector : selector;
            }, "");
        }
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

    /**
     * @function idSelector
     * @param {string} id
     * @return {string}
     */
    function idSelector(id) {
        return "#" + cssEscaper.escape(id);
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

    /**
     * @function isUniqueSelector
     * detect selector is unique
     * @param {String} selector
     * @return {boolean} unique selector?
     */
    function isUniqueSelector(selector) {
        if (!options.querySelectorAll) {
            return true;
        }
        return options.querySelectorAll(selector).length < 2;
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
     * get unique selector
     * @method
     * @param {HTMLElement} node html element
     * @param {boolean?} optimized get short selector
     * @returns {String} selector
     */
    this.getSelector = getSelector;
    /**
     * path of node
     * @method
     * @param {HTMLElement} node html element
     * @returns {String} path
     */
    this.getPath = getPath;
}

exports.SelectorGenerator = SelectorGenerator;