/// <reference path="domParser.js"/>
/// <reference path="fakeElementSelectors.js"/>
/// <reference path="../selector-generator.js"/>
/* global SelectorGenerator, fakeElementSelectors */
describe("selectorGenerator.getSelector", function () {

    describe("with native web elements", function () {
        function selectorTest(elementDefinition) {
            var element = elementDefinition.getElement();
            var generator = new SelectorGenerator({querySelectorAll:document.querySelectorAll.bind(elementDefinition.dom)});
            var selector = generator.getSelector(element);
            expect(selector).toEqual(elementDefinition.selector);
        }

        for (var index in fakeElementSelectors) {
            if (fakeElementSelectors.hasOwnProperty(index)) {
                var fakeElementSelector = fakeElementSelectors[index];
                it("get selector of " + fakeElementSelector.type, (function (fakeElementSelector) {
                    return function () {
                        selectorTest(fakeElementSelector);
                    };
                }(fakeElementSelector)));
            }
        }
    });

    describe("with fake elements", function () {
        var querySelectorAllMock = function () {
            return [];
        };
        it("return empty if node is null or undefined", function () {
            var generator = new SelectorGenerator();
            var result = generator.getSelector(null);
            var result2 = generator.getSelector(undefined);
            expect(result).toBe("");
            expect(result2).toBe("");
        });

        it("return empty if node nodeType is not element", function () {
            var htmlElement = typeof HTMLElement !== "undefined" ? HTMLElement : typeof Element !== "undefined"? Element: {} ;
            htmlElement.nodeType = 2;
            var generator = new SelectorGenerator();
            var result = generator.getSelector(htmlElement);
            expect(result).toBe("");
        });

        it("return empty if node siblings is not element", function () {
            var node = {
                nodeType: 1,
                parentNode: {children: [{nodeType: 2, nodeName: "comment"}]},
                getAttribute: jasmine.createSpy(),
                nodeName: "input"
            };
            var generator = new SelectorGenerator();
            var result = generator.getSelector(node);
            expect(result).toBe("input");
        });

        it("return tag body or html or head if optmized enable", function () {
            var node = {nodeType: 1, getAttribute: jasmine.createSpy(), nodeName: "body", parentNode: {nodeType: 9}};
            var node2 = {nodeType: 1, getAttribute: jasmine.createSpy(), nodeName: "html", parentNode: {nodeType: 9}};
            var node3 = {nodeType: 1, getAttribute: jasmine.createSpy(), nodeName: "head", parentNode: {nodeType: 9}};
            var generator = new SelectorGenerator({querySelectorAll:querySelectorAllMock});
            var result = generator.getSelector(node);
            var result2 = generator.getSelector(node2);
            var result3 = generator.getSelector(node3);
            expect(result).toEqual("body");
            expect(result2).toEqual("html");
            expect(result3).toEqual("head");
        });

        // ReSharper disable NativeTypePrototypeExtending
        it("call shims if native not supported", function () {

            var node = {
                nodeType: 1, className: "test test3", getAttribute: jasmine.createSpy(), nodeName: "input",
                parentNode: {
                    children: [
                        {nodeType: 1, nodeName: "input", className: "test test2", getAttribute: jasmine.createSpy()}
                    ]
                }
            };
            var map = Array.prototype.map;
            var reduce = Array.prototype.reduce;
            var filter = Array.prototype.filter;

            /* eslint-disable no-extend-native*/
            Array.prototype.map = null;
            Array.prototype.reduce = null;
            Array.prototype.filter = null;
            var generator = new SelectorGenerator();
            var result = generator.getSelector(node);

            Array.prototype.map = map;
            Array.prototype.reduce = reduce;
            Array.prototype.filter = filter;
            /*eslint-enable no-extend-native*/

            expect(result).toContain("input.test.test3");

        });

        it("get node.className if node.getAttribute('class') not working", function () {
            var node = {
                nodeType: 1, className: "test test3", getAttribute: jasmine.createSpy(), nodeName: "input",
                parentNode: {
                    children: [
                        {nodeType: 1, nodeName: "input", className: "test test2", getAttribute: jasmine.createSpy()}
                    ]
                }
            };
            var generator = new SelectorGenerator();
            var result = generator.getSelector(node);
            expect(result).toContain("input.test.test3");
        });


        it("check unique of selector", function () {
            var node = {
                nodeType: 1,
                getAttribute: function () {
                    return "id";
                },
                nodeName: "input"
            };
            var parentNode = {
                nodeName: "form"
            };
            node.parentNode = parentNode;
            parentNode.children = [node];
            var expectedSelector = "input#id";
            var isCalled = false;
            var querySelectorAll = function () {
                isCalled = true;
                return [node];
            };
            var generator = new SelectorGenerator({querySelectorAll:querySelectorAll});
            var result = generator.getSelector(node);

            expect(result).toBe(expectedSelector);
            expect(isCalled).toBeTruthy();
        });

        it("not check unique of selector when querySelectorAll dependency not defined", function () {
            var node = {
                nodeType: 1,
                getAttribute: function () {
                    return "id";
                },
                nodeName: "input"
            };
            var parentNode = {
                nodeName: "form"
            };
            node.parentNode = parentNode;
            parentNode.children = [node];
            var expectedSelector = "input#id";
            var generator = new SelectorGenerator({querySelectorAll:null});
            var result = generator.getSelector(node);

            expect(result).toBe(expectedSelector);
        });

        it("not simplify selector if selector short", function () {
            var node = {nodeType: 1, nodeName: "input", getAttribute: jasmine.createSpy()};
            var parentNode = {nodeType: 1, nodeName: "form", getAttribute: jasmine.createSpy(), children: [node]};
            var documentNode = {nodeType: 9};
            node.parentNode = parentNode;
            parentNode.parentNode = documentNode;

            var expectedSelector = "form > input";
            var querySelectorAll = function () {
                return [node];
            };
            var generator = new SelectorGenerator({querySelectorAll:querySelectorAll});
            var result = generator.getSelector(node);

            expect(result).toBe(expectedSelector);
        });

        it("not simplify selector if selector long", function () {
            var node = {nodeType: 1, nodeName: "input", getAttribute: jasmine.createSpy()};
            var parentNode = {nodeType: 1, nodeName: "form", getAttribute: jasmine.createSpy(), children: [node]};
            var parentNode2 = {nodeType: 1, nodeName: "div", getAttribute: jasmine.createSpy(), children: [parentNode]};
            var parentNode3 = {
                nodeType: 1,
                nodeName: "body",
                getAttribute: jasmine.createSpy(),
                children: [parentNode2]
            };
            var documentNode = {nodeType: 9};
            node.parentNode = parentNode;
            parentNode.parentNode = parentNode2;
            parentNode2.parentNode = parentNode3;
            parentNode3.parentNode = documentNode;

            var expectedSelector = "form > input";
            var querySelectorAll = function () {
                return [node];
            };
            var generator = new SelectorGenerator({querySelectorAll:querySelectorAll});
            var result = generator.getSelector(node);

            expect(result).toBe(expectedSelector);
        });
    });


});

describe("selectorGenerator.getPath", function () {
    describe("with native web elements", function () {
        function pathTest(elementDefinition) {
            var element = elementDefinition.getElement();
            var generator = new SelectorGenerator();
            var result = generator.getPath(element);
            expect(result).toEqual(elementDefinition.path);
        }

        for (var index in fakeElementSelectors) {
            if (fakeElementSelectors.hasOwnProperty(index) && fakeElementSelectors[index].path) {
                var fakeElementSelector = fakeElementSelectors[index];
                it("get path of " + fakeElementSelector.type, (function (fakeElementSelector) {
                    return function () {
                        pathTest(fakeElementSelector);
                    };
                }(fakeElementSelector)));
            }
        }
    });
});