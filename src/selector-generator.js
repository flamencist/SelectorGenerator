/*global  SelectorGeneratorStep */ //eslint-disable-line no-unused-vars
/**
 * @class
 * get unique selector, path of node
 * @param {Object?} options
 * @param {function?} options.querySelectorAll
 * @constructor
 */
function SelectorGenerator(options) { //eslint-disable-line no-unused-vars

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
        var selectorGeneratorStep = new SelectorGeneratorStep({
            withoutNthChild: true,
            optimized: false,
            targetNode: node
        });
        var steps = [];
        var contextNode = node;
        while (contextNode) {
            var step = selectorGeneratorStep.visit(contextNode);
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
        var selectorGeneratorStep = new SelectorGeneratorStep({optimized: !!optimized, targetNode: node});
        var steps = [];
        var contextNode = node;
        while (contextNode) {
            var step = selectorGeneratorStep.visit(contextNode);
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