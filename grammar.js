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
          $.natural,
          $.integer,
          $.revolution,
          $.fraction,
          $.text,
          $.identifier,
          $.tag,
          $.form,
          $.tuple,
          $.record,
        ),
      ),

    bit: _ => /#[01]/,

    natural: $ => $.__natural,
    __natural: $ => prec.right(seq($.__digit, repeat(choice($.__digit, ',')))),
    __digit: _ => choice('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'),

    integer: $ => $.__integer,
    __integer: $ => seq($.__sign, $.__natural),
    __sign: _ => choice('+', '-'),

    revolution: $ => $.__revolution,
    __revolution: $ => seq('.', $.__natural),

    fraction: $ => seq($.__integer, $.__revolution),

    text: _ => seq('"', repeat(/[^"]/), '"'),

    __identifier_start_character: $ =>
      // need to add sign explicitly and reduce precendence as otherwise tree
      // sitter would try to match as an integer and fail
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
      choice($.bit, $.natural, $.integer, $.revolution, $.fraction, $.identifier, $.tag),
  },

  extras: _ => [],
  inline: $ => [
    $.__identifier_start_character,
    $.__identifier_inside_character,
    $.__identifier_without_dots,
    $.__identifier_without_dots,
    $.__identifier_with_intermediate_dots,
    $.__identifier,
    $.__natural,
    $.__integer,
    $.__sign,
    $.__digit,
    $.__revolution,
    $.__enclosed,
    $.__non_enclosed,
  ],
  conflicts: $ => [
    [$.integer, $.identifier, $.fraction],
    [$.integer, $.identifier],
    [$.identifier, $.fraction],
    [$.fraction, $.integer],
    [$.revolution, $.identifier],
  ],
});
