module.exports = grammar({
  name: 'lux',

  rules: {
    source_file: $ => repeat($._expression),
    _expression: $ => choice($._comment),
    _comment: $ => choice($.inline_comment, $.block_comment),
    inline_comment: _ => seq('##', repeat(/./),),
    block_comment: $ => seq('#(', repeat(choice(/./, $.block_comment)), ')'),
  },

  extras: $ => ['\n']
});