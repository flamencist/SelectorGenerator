module.exports = function(config) {
  config.set({
    browsers:  ["PhantomJS"],
    frameworks: ["jasmine"],
    files: [
      "selectorGenerator.js",
      "tests/domParser.js",
      "tests/fakeElementSelectors.js",
      "tests/**/*.spec.js"
    ]
  });
};