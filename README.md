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

This produces the following syntax tree

```
(lux
  (form
    (identifier)
    (natural)
    (natural)))
```

## current features

Currently the grammar recognizes all the basic Lux literals comment, bit, natural, integer, revolution, fraction, text, identifier, tag, form, tuple and record.

## planned features

Recognizing definitions, anonymous functions and modules

## api
The node types in the abstract syntax tree generated by tree-sitter correspond to Lux syntax tokens.
Additional meaning that is derived from those syntax tokens, e.g. that`(def: x Int +1)` is a definition,
might be encoded using fields on the node.

The top level node type is always `lux`.
Children of the `lux` node are of one of the following types:

### `comment`
Recognizes comments, e.g. `## this is a comment`.

### `bit`
Recognizes bits, e.g. `#0` and `#1`.

### `natural`
Recognizes naturals, e.g. `123`.

### `integer`
Recognizes integers, e.g. `+123` and `-456`.

### `revolution`
Recognizes revolutions, e.g. `.123`.

### `fraction`
Recognizes fractions, e.g. `+123.456`.

### `text`
Recognizes text, e.g. `"text"`.

### `identifier`
Recognizes identifiers, e.g. `identifier`, `prefix.identifier`, or `..identifier`.

### `tag`
Recognizes tags, e.g. `#tag`.

### `form`
Recognizes forms, e.g. `(+ 1 2)`.
This example produces the following syntax tree:

    (lux
      (form
        (identifier)
        (natural)
        (natural)))

Children of form nodes can be of any of the top level types.

### `tuple`
Recognizes tuples, e.g. `[a +2 "c"]`.
This example produces the following syntax tree:

    (lux
      (tuple
        (identifier)
        (integer)
        (text)))

Children of form nodes can be of any of the top level types.

### `record`
Recognizes records, e.g. `{#a b "c" 4}`.
This example produces the following syntax tree:

    (lux
      (record
        (pair (tag) (identifier))
        (pair (text) (natural))))

Children of record nodes can be of type `comment` or `pair`.

#### `pair`
Recognizes pairs of syntax tokens, but only inside records, e.g. `#a b` inside `{#a b}`.
Children of pair nodes can be of any of the top level types.

> Don't assume that there are exactly two children inside a pair.
> There might be a comment between the key and value.
> However, you can assume that there are always exactly two non-comment nodes inside a pair.
> Otherwise there would be an error.

### `ERROR` or `MISSING`
Anything that is not recognized as valid Lux syntax will be encoded by a node of type `ERROR` or `MISSING`.
