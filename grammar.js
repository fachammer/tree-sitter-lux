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
  , _sign: _ => choice('+','-')
  , _digit: _ => choice('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')
  , _comma: _ => /,/
  , _natural: $ => prec.right(seq($._digit, repeat(choice($._digit, $._comma))))
  , natural: $ => $._natural
  , _int: $ => seq($._sign, $._natural)
  , int: $ => $._int
  , _rev: $ => prec.right(seq('.', $._natural))
  , rev: $ => $._rev
  , frac: $ => prec(1, seq($._int, $._rev))
  , bit: _ => /#[01]/
  , _identifier_start_character: $ =>
    // need to add sign explicitly and reduce precendence as otherwise tree 
    // sitter would try to match as an integer and fail 
    // e.g. +, -, +this-symbol is valid, -this-symbol-is-valid
    prec(-1, choice(/[^#\(\)\[\]\{\}0-9 "\n\r\.]/, $._sign))
  , _identifier_inside_character: $ =>
    choice($._identifier_start_character, $._digit)
  , _identifier_without_dots: $ => prec.right(seq(
    $._identifier_start_character
    , repeat($._identifier_inside_character)))
  , _identifier: $ =>
    prec.right(seq(
      $._identifier_without_dots
      , optional(seq('.', $._identifier_without_dots))))
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
