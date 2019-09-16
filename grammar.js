module.exports = grammar({
  name: 'lux'

, rules: {
    source_file: $ => repeat($._white_spaced_expression)
  , _expression: $ =>
    choice($._comment
      , $._number
      , $.bool
      , $.tag
      , $.symbol
      , $.string
      , $.list
      , $.tuple
      , $.record)
  , _comment: $ => choice($.inline_comment)
  , inline_comment: _ => seq('##', repeat(/./))
  , _number: $ => choice($.int, $.real)
  , _sign: _ => /[+-]/
  , _digit: _ => /[0-9]/
  , _natural: $ => repeat1($._digit)
  , _int: $ => prec.right(seq(optional($._sign), $._natural))
  , int: $ => $._int
  , _exponential_delimiter: _ => /[eE]/
  , _exponential_suffix: $ => seq($._exponential_delimiter, $._int)
  , _decimal_part: $ => prec.right(seq(/\./, $._natural))
  , real: $ =>
    seq(
      optional($._sign)
      , choice(
        seq($._decimal_part, optional($._exponential_suffix))
        , seq($._natural, $._exponential_suffix)
        , seq($._natural, $._decimal_part, optional($._exponential_suffix))))
  , bool: _ => /true|false/
  , _symbol_start: _ => /[^#\(\)\[\]\{\}0-9\s"]/
  , _symbol: $ =>
    prec.right(seq($._symbol_start, repeat(choice($._symbol_start, $._digit))))
  , symbol: $ => $._symbol
  , tag: $ => seq('#', $._symbol)
  , _white_space: $ => prec.right(repeat1(choice($._end_line, / /)))
  , _white_spaced_expression: $ =>
    prec.right(
      seq(
        optional($._white_space)
        , repeat1($._expression)
        , optional($._white_space)))
  , list: $ => seq('(', repeat($._white_spaced_expression), ')')
  , _end_line: _ => /[\r\n]|\r\n/
  , string: _ => seq('"', repeat(/[^"]/), '"')
  , tuple: $ => seq('[', repeat($._white_spaced_expression), ']')
  , record_pair: $ => seq(optional($._white_space), $.tag, $._white_space, $._white_spaced_expression)
  , record: $ => seq('{', repeat($.record_pair), '}')
  }

, extras: _ => []
});
