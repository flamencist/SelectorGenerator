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
});