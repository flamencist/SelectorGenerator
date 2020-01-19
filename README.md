# SelectorGenerator

[![Built with Gulp](http://img.shields.io/badge/built%20with-gulp.js-red.svg)](http://gulpjs.com/)
[![devDependency Status](https://david-dm.org/flamencist/SelectorGenerator/dev-status.svg)](https://david-dm.org/flamencist/SelectorGenerator#info=devDependencie)
[![Build Status](https://secure.travis-ci.org/flamencist/SelectorGenerator.svg)](http://travis-ci.org/flamencist/SelectorGenerator)


JavaScript object that creates a unique CSS selector for a given DOM element. It has no external dependencies.
 
## Overview    
    var generator = new SelectorGenerator();
    var element = document.querySelector("input"); // <input type="text" id="login" />
    var selector = generator.getSelector(element); //=> #login
    var path = generator.getPath(element); //=> body > div > input

## Installation

### Node.js

To install __SelectorGenerator__ module for Node.js, this command should be used:

	npm install selector-generator
	
Or [yarn](https://yarnpkg.com/lang/en/):

    yarn add selector-generator

## Tests

You can view the results of the SelectorGenerator test suite [in your browser!](https://rawgit.com/flamencist/SelectorGenerator/master/spec-runner.html)

### License

This software is distributed under the terms of the MIT License (MIT).

### Authors

Alexander Chermyanin / [LinkedIn](https://www.linkedin.com/in/alexander-chermyanin)



Contributions and bugs reports are welcome.
