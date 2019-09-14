module.exports = grammar({
  name: 'lux',

  rules: {
    source_file: $ => repeat($._expression),
    _expression: $ => choice($._comment, $.int),
    _comment: $ => choice($.inline_comment, $.block_comment),
    inline_comment: _ => seq('##', repeat(/./),),
    block_comment: $ => seq('#(', repeat(choice(/./, $.block_comment)), ')'),
    int: $ => /[+-]?[0-9]+/
  },

  extras: $ => ['\n']
});