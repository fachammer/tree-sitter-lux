function multiple_expressions($) {
  return seq(
    repeat($._white_space),
    repeat(
      seq(
        choice(
          seq($.__non_enclosed, choice($.__enclosed, $._white_space)),
          $.__enclosed,
        ),
        repeat($._white_space),
      ),
    ),
    optional($._expression),
  );
}

module.exports = grammar({
  name: 'lux',

  rules: {
    lux: $ => multiple_expressions($),
    _expression: $ =>
      prec(
        1,
        choice(
          $.bit,
          $.nat,
          $.int,
          $.rev,
          $.frac,
          $.text,
          $.identifier,
          $.tag,
          $.form,
          $.tuple,
          $.record,
        ),
      ),

    bit: _ => /#[01]/,

    nat: $ => $.__nat,
    __nat: $ => prec.right(seq($.__digit, repeat(choice($.__digit, ',')))),
    __digit: _ => choice('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'),

    int: $ => $.__int,
    __int: $ => seq($.__sign, $.__nat),
    __sign: _ => choice('+', '-'),

    rev: $ => $.__rev,
    __rev: $ => seq('.', $.__nat),

    frac: $ => seq($.__int, $.__rev),

    text: _ => seq('"', repeat(/[^"]/), '"'),

    __identifier_start_character: $ =>
      // need to add sign explicitly and reduce precendence as otherwise tree
      // sitter would try to match as an int and fail
      // e.g. +, -, +this-symbol is valid, -this-symbol-is-valid
      choice(/[^#\(\)\[\]\{\}0-9 "\n\r\.]/, $.__sign),
    __identifier_inside_character: $ =>
      choice($.__identifier_start_character, $.__digit),
    __identifier_without_dots: $ =>
      prec.right(
        seq(
          $.__identifier_start_character,
          repeat($.__identifier_inside_character),
        ),
      ),
    __starting_dot_identifier: $ =>
      seq('.', optional('.'), $.__identifier_without_dots),
    __identifier_with_intermediate_dots: $ =>
      seq($.__identifier_without_dots, '.', $.__identifier_without_dots),
    __identifier: $ =>
      choice(
        $.__starting_dot_identifier,
        $.__identifier_without_dots,
        $.__identifier_with_intermediate_dots,
      ),
    identifier: $ => $.__identifier,

    tag: $ => seq('#', $.__identifier),

    form: $ => seq('(', multiple_expressions($), ')'),
    tuple: $ => seq('[', multiple_expressions($), ']'),

    record: $ =>
      seq(
        '{',
        seq(
          repeat($._white_space),
          repeat(seq($.pair, repeat($._white_space))),
        ),
        '}',
      ),
    pair: $ =>
      seq($._expression, repeat1($._white_space), $._expression),

    _white_space: $ => choice($._end_line, /\s/, $.comment),
    _end_line: _ => /[\r\n]|\r\n/,

    comment: _ => /##.*/,

    __enclosed: $ => choice($.text, $.form, $.tuple, $.record),
    __non_enclosed: $ =>
      choice($.bit, $.nat, $.int, $.rev, $.frac, $.identifier, $.tag),
  },

  extras: _ => [],
  inline: $ => [
    $.__identifier_start_character,
    $.__identifier_inside_character,
    $.__identifier_without_dots,
    $.__identifier_without_dots,
    $.__identifier_with_intermediate_dots,
    $.__identifier,
    $.__nat,
    $.__int,
    $.__sign,
    $.__digit,
    $.__rev,
    $.__enclosed,
    $.__non_enclosed,
  ],
  conflicts: $ => [
    [$.int, $.identifier, $.frac],
    [$.int, $.identifier],
    [$.identifier, $.frac],
    [$.frac, $.int],
    [$.rev, $.identifier],
  ],
});
