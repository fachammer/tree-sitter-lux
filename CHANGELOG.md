# changelog

# [2.1.0](https://github.com/fachammer/tree-sitter-lux/compare/v2.0.0...v2.1.0) (2019-09-29)


### Features

* build .wasm file ([32ea9ec](https://github.com/fachammer/tree-sitter-lux/commit/32ea9ec))

# [2.0.0](https://github.com/fachammer/tree-sitter-lux/compare/v1.1.1...v2.0.0) (2019-09-29)


### Code Refactoring

* change source_file node to lux ([258b9a5](https://github.com/fachammer/tree-sitter-lux/commit/258b9a5))
* remove necessity for whitespace ([4e9cfa4](https://github.com/fachammer/tree-sitter-lux/commit/4e9cfa4))
* rename "inline_comment" to "comment" ([bf32031](https://github.com/fachammer/tree-sitter-lux/commit/bf32031))
* rename "record_pair" to "pair" ([a78adb3](https://github.com/fachammer/tree-sitter-lux/commit/a78adb3))
* rename shorthand types to long name ([d3770dd](https://github.com/fachammer/tree-sitter-lux/commit/d3770dd))


### Features

* add support for exponential notation ([0193f76](https://github.com/fachammer/tree-sitter-lux/commit/0193f76))
* get key and value as fields from record pair ([ed2badf](https://github.com/fachammer/tree-sitter-lux/commit/ed2badf))


### BREAKING CHANGES

* between expressions there is now no strict need for
whitespace. This is in line with how Lux handles juxtaposition of
expressions, as it is not necessary to have whitespace when the parser
can figure out and pull apart the given expressions
* The following nodes were renamed. This change was made as the longer
canonical names better convey the meaning of the syntax token
  * nat -> natural
  * int -> integer
  * rev -> revolution
  * frac -> fraction
* Consumers should now expect a node of type "pair"
where before there was a node of type "record_pair".
The specificity of "record_pair" is unnecessary here as the pair can only
occur inside a record
* Consumers should now expect a node of type "comment"
where before there was a node of type "inline_comment.
The specificity of "inline_comment" is unnecessary here as there is only one
type of comment in Lux
* "source_file" node type is now called "lux".
This better reflects what is actually parsed because also ordinary
text could be parsed that doesn't come from a file and it signifies
that it's lux code.
Consumers should now expect a node of type "lux" where before
there was a node of type "source_file"

## [1.1.1](https://github.com/fachammer/tree-sitter-lux/compare/v1.1.0...v1.1.1) (2019-09-20)


### Performance Improvements

* pass all files to tree-sitter parse at once ([c520d73](https://github.com/fachammer/tree-sitter-lux/commit/c520d73))

# [1.1.0](https://github.com/fachammer/tree-sitter-lux/compare/v1.0.2...v1.1.0) (2019-09-19)


### Features

* add badges ([#7](https://github.com/fachammer/tree-sitter-lux/issues/7)) ([c20095a](https://github.com/fachammer/tree-sitter-lux/commit/c20095a))

## [1.0.2](https://github.com/fachammer/tree-sitter-lux/compare/v1.0.1...v1.0.2) (2019-09-19)


### Bug Fixes

* make npmignore more permissive ([f8db841](https://github.com/fachammer/tree-sitter-lux/commit/f8db841))

## [1.0.1](https://github.com/fachammer/tree-sitter-lux/compare/v1.0.0...v1.0.1) (2019-09-19)


### Bug Fixes

* put build files in published package ([1907d51](https://github.com/fachammer/tree-sitter-lux/commit/1907d51))

# 1.0.0 (2019-09-19)

### Features

- parse all basic lux literals ([3f06592](https://github.com/fachammer/tree-sitter-lux/commit/3f06592))
