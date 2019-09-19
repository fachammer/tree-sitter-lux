# tree-sitter-lux [![Build Status](https://dev.azure.com/fabianachammer/tree-sitter-lux/_apis/build/status/fachammer.tree-sitter-lux?branchName=master&label=build)](https://dev.azure.com/fabianachammer/tree-sitter-lux/_build/latest?definitionId=3&branchName=master&label=build)

tree-sitter-lux is a [Tree-sitter](http://tree-sitter.github.io/tree-sitter/) grammar for the [Lux language](https://github.com/LuxLang/lux). It is based on this [syntax document](https://github.com/LuxLang/lux/blob/4049370ec0d0bec578b8fcb83700d020e81386c4/documentation/specification/Syntax.md).

## Installation

```bash
npm install tree-sitter tree-sitter-lux
```

## Usage

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
(source_file (identifier) (nat) (nat))
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
