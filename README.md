# tree-sitter-lux

[![Build Status](https://dev.azure.com/fabianachammer/tree-sitter-lux/_apis/build/status/release?branchName=master&label=build)](https://dev.azure.com/fabianachammer/tree-sitter-lux/_build/latest?definitionId=7&branchName=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![NPM Version](https://img.shields.io/npm/v/tree-sitter-lux)](https://www.npmjs.com/package/tree-sitter-lux)
[![MIT](https://img.shields.io/github/license/fachammer/tree-sitter-lux)](https://choosealicense.com/licenses/mit/)

tree-sitter-lux is a [Tree-sitter](http://tree-sitter.github.io/tree-sitter/)
grammar for the [Lux language](https://github.com/LuxLang/lux).
It is based on this [syntax document](https://github.com/LuxLang/lux/blob/4049370ec0d0bec578b8fcb83700d020e81386c4/documentation/specification/Syntax.md).

## installation

```bash
npm install tree-sitter tree-sitter-lux
```

## usage

A basic nodejs script might look like this:

```javascript
const Parser = require('tree-sitter');
const Lux = require('tree-sitter-lux');

const parser = new Parser();
parser.setLanguage(Lux);

const sourceCode = '(+ 1 1)';
const tree = parser.parse(sourceCode);

console.log(tree.rootNode.toString());
```

This would print

```
(source_file (form (identifier) (nat) (nat)))
```

## current features

Currently the grammar recognizes all the basic Lux literals bit, nat, int, rev, frac, identifier, tag, form, tuple, record and inline comment.

## planned features

Recognizing definitions, functions and some types from the stdlib
