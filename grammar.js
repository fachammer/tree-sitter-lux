module.exports = grammar({
  name: 'lux',

  rules: {
    source_file: $ => repeat($._expression),
    _expression: $ => choice($._comment, $._number, $.bool),
    _comment: $ => choice($.inline_comment, $.block_comment),
    inline_comment: _ => seq('##', repeat(/./),),
    block_comment: $ => seq('#(', repeat(choice(/./, $.block_comment)), ')'),
    _number: $ => choice($.int, $.real),
    _sign: _ => /[+-]/,
    _digit: _ => /[0-9]/,
    _natural: $ => repeat1($._digit),
    _int: $ => prec.right(seq(optional($._sign), $._natural)),
    int: $ => $._int,
    _exponential_delimiter: _ => /[eE]/,
    _exponential_suffix: $ => seq($._exponential_delimiter, $._int),
    _decimal_part: $ => prec.right(seq(/\./, $._natural)),
    real: $ =>
      seq(
        optional($._sign), 
        choice(
          seq($._decimal_part, optional($._exponential_suffix)),
          seq($._natural, $._exponential_suffix),
          seq($._natural, $._decimal_part, optional($._exponential_suffix)))),
    bool: _ => /true|false/
  },

  extras: _ => ['\n'],
});