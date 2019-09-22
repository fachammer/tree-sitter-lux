try {
  const Parser = require('tree-sitter');
  const Lux = require('tree-sitter-lux');

  const parser = new Parser();
  parser.setLanguage(Lux);

  const sourceCode = '(+ 1 1)';
  const tree = parser.parse(sourceCode);
  const result = tree.rootNode.toString();


  const assert = require('assert');
  assert.equal(result, "(lux (form (identifier) (nat) (nat)))");
  console.log("packaging correct!");
}
catch (e) {
  console.error("error in packaging", e);
}
