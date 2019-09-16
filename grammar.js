module.exports = grammar({
  name: 'lux'

, rules: {
    source_file: $ => repeat($._white_spaced_expression)
  , _expression: $ =>
    choice($._comment
      , $._number
      , $.bit
      , $.tag
      , $.identifier
      , $.text
      , $.form
      , $.tuple
      , $.record)
  , _comment: $ => choice($.inline_comment)
  , inline_comment: _ => seq('##', repeat(/./))
  , _number: $ => choice($.natural, $.int, $.rev, $.frac)
  , _sign: _ => /[+-]/
  , _digit: _ => /[0-9]/
  , _comma: _ => /,/
  , _natural: $ => prec.right(seq($._digit, repeat(choice($._digit, $._comma))))
  , natural: $ => prec.right($._natural)
  , _int: $ => prec.right(seq($._sign, $._natural))
  , int: $ => $._int
  , _rev: $ => prec.right(seq(/\./, $._natural))
  , rev: $ => $._rev
  , frac: $ => prec(1, seq($._int, $._rev))
  , bit: _ => /#[0-1]/
  , _identifier_start: _ => /[^#\(\)\[\]\{\}0-9\s"]/
  , _identifier: $ =>
    prec.right(seq($._identifier_start, repeat(choice($._identifier_start, $._digit))))
  , identifier: $ => $._identifier
  , tag: $ => seq('#', $._identifier)
  , _white_space: $ => choice($._end_line, / /)
  , _white_spaced_expression: $ =>
    prec.right(
      seq(
        repeat($._white_space)
        , repeat1($._expression)
        , repeat($._white_space)))
  , form: $ => seq('(', repeat($._white_spaced_expression), ')')
  , _end_line: _ => /[\r\n]|\r\n/
  , text: _ => seq('"', repeat(/[^"]/), '"')
  , tuple: $ => seq('[', repeat($._white_spaced_expression), ']')
  , record_pair: $ => seq(repeat($._white_space), $.tag, $._white_space, $._white_spaced_expression)
  , record: $ => seq('{', repeat($.record_pair), '}')
  }

, extras: _ => []
});
