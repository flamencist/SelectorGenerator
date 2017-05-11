module.exports = function(config) {
  config.set({
    browsers:  ["PhantomJS"],
    frameworks: ["jasmine"],
    files: [
      "src/selectorGenerator.js",
      "tests/domParser.js",
      "tests/fakeElementSelectors.js",
      "tests/**/*.spec.js"
    ]
  });
};