const glob = require("glob");
const child_process = require("child_process");
const { promisify } = require("util");
const exec = promisify(child_process.exec);
const asyncGlob = promisify(glob);

const maxBuffer = 10 * 1024 * 1024;
const globPattern = "examples/lux/stdlib/source/**/*.lux";
const maxCommandLineLength = 4000;

function countText(singular, array) {
  return array.length === 1
    ? `${array.length} ${singular}`
    : `${array.length} ${singular}s`;
}

(async function main() {
  const files = await asyncGlob(globPattern);
  const filesCopy = [...files];

  const commandPrefix = "npx tree-sitter parse --quiet ";

  const command = (files) => commandPrefix + files.join(" ");

  const fileBatches = [];

  while (files.length > 0) {
    const fileBatch = [];

    while (
      command([...fileBatch, files[0]]).length < maxCommandLineLength &&
      files.length > 0
    ) {
      fileBatch.push(files.shift());
    }

    fileBatches.push(fileBatch);
  }

  try {
    for (const fileBatch of fileBatches) {
      await exec(command(fileBatch), {
        maxBuffer,
      });
    }

    console.log(`successfully parsed ${countText("file", filesCopy)}!`);
    process.exit(0);
  } catch (error) {
    if (!error.stdout) {
      throw error;
    }

    const errorFiles = error.stdout
      .split("\n")
      .filter((line) => line)
      .map((line) => line.match(/[^\s]+(?=\s)/)[0]);

    const parseErrors = [];
    for (const file of errorFiles) {
      try {
        await exec("npx tree-sitter parse " + file, { maxBuffer });
      } catch (err) {
        if (!err.stdout) {
          throw err;
        }
        var fileErrors = err.stdout.match(
          /\(ERROR \[(\d+), (\d+)\] - \[(\d+), (\d+)\]\)/g
        );

        let errorObject = { file, errors: [] };
        for (const fileError of fileErrors) {
          const { start_line, start_character, end_line, end_character } =
            fileError.match(
              /\(ERROR \[(?<start_line>\d+), (?<start_character>\d+)\] - \[(?<end_line>\d+), (?<end_character>\d+)\]\)/
            ).groups;

          const error = `line${start_line === end_line ? "" : "s"} ${
            start_line === end_line
              ? parseInt(start_line) + 1
              : start_line + "-" + end_line
          }, columns ${start_character}-${end_character}`;
          errorObject.errors.push(error);
        }
        parseErrors.push(errorObject);
      }
    }

    console.log(`errors in ${countText("file", parseErrors)} \n`);
    for (const { file, errors } of parseErrors) {
      console.log(`${countText("error", errors)} in ${file}`);
      for (const error of errors) {
        console.log(`  ${error}`);
      }
      console.log();
    }
    process.exit(1);
  }
})();
