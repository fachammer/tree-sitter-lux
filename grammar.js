function multiple_expressions($) {
  return seq(
    repeat($._white_space),
    repeat(seq($._expression, repeat1($._white_space))),
    optional($._expression),
  );
}

module.exports = grammar({
  name: 'lux',

  rules: {
    source_file: $ => multiple_expressions($),
    _expression: $ =>
      choice(
        $.bit,
        $._number,
        $.text,
        $.identifier,
        $.tag,
        $.form,
        $.tuple,
        $.record,
        $.inline_comment,
      ),

    bit: _ => /#[01]/,

    _number: $ => choice($.nat, $.int, $.rev, $.frac),
    nat: $ => $._nat,
    _nat: $ => prec.right(seq($._digit, repeat(choice($._digit, $._comma)))),
    _digit: _ => choice('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'),
    _comma: _ => /,/,

    int: $ => $._int,
    _int: $ => seq($._sign, $._nat),
    _sign: _ => choice('+', '-'),

    rev: $ => $._rev,
    _rev: $ => prec.right(seq('.', $._nat)),

    frac: $ => prec(1, seq($._int, $._rev)),

    text: _ => seq('"', repeat(/[^"]/), '"'),

    _identifier_start_character: $ =>
      // need to add sign explicitly and reduce precendence as otherwise tree
      // sitter would try to match as an int and fail
      // e.g. +, -, +this-symbol is valid, -this-symbol-is-valid
      prec(-1, choice(/[^#\(\)\[\]\{\}0-9 "\n\r\.]/, $._sign)),
    _identifier_inside_character: $ =>
      choice($._identifier_start_character, $._digit),
    _identifier_without_dots: $ =>
      prec.right(
        seq(
          $._identifier_start_character,
          repeat($._identifier_inside_character),
        ),
      ),
    identifier_without_dots: $ => $._identifier_without_dots,
    _identifier: $ =>
      prec.right(
        seq(
          choice(
            seq(optional('.'), '.', $._identifier_without_dots),
            seq($._identifier_without_dots),
            seq(
              $._identifier_without_dots,
              seq('.', $._identifier_without_dots),
            ),
          ),
        ),
      ),
    identifier: $ => $._identifier,

    tag: $ => seq('#', $._identifier),

    form: $ => seq('(', multiple_expressions($), ')'),

    tuple: $ => seq('[', multiple_expressions($), ']'),

    record: $ => seq('{', repeat($.record_pair), '}'),
    record_pair: $ =>
      prec.left(
        seq(
          repeat($._white_space),
          $._expression,
          repeat1($._white_space),
          $._expression,
          repeat($._white_space),
        ),
      ),

    inline_comment: _ => /##.*/,

    _white_space: $ => choice($._end_line, / /),
    _white_space_surrounded_expression: $ =>
      seq(
        repeat($._white_space),
        $._expression,
        repeat1($._white_space),
        optional($._expression),
      ),
    _end_line: _ => /[\r\n]|\r\n/,
  },

  extras: _ => [],
  inline: $ => [$._multiple_expressions],
});
