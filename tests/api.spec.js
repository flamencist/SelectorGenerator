/* global SelectorGenerator */
describe("Api",function(){
    it("should have property 'version'", function () {
        expect(SelectorGenerator.version).not.toBeUndefined();
    });
    it("should have method 'getSelector'", function () {
        expect(new SelectorGenerator().getSelector).not.toBeUndefined();
    });

    it("should have method 'getPath'", function () {
        expect(new SelectorGenerator().getPath).not.toBeUndefined();
    });

    if (typeof require === "undefined") {
        it("should have method 'noConflict'", function () {
            expect(SelectorGenerator.noConflict).not.toBeUndefined();
        });

        it("should call noConflict", function () {
            var oldSelectorGenerator = SelectorGenerator;
            var localSelectorGenerator = SelectorGenerator.noConflict();
            expect(localSelectorGenerator).not.toBeUndefined();
            expect(SelectorGenerator).toBeUndefined();
            SelectorGenerator = oldSelectorGenerator;
        });
    }
});