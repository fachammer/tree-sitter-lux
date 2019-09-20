const glob = require('glob');
const child_process = require('child_process');
const { promisify } = require('util');
const exec = promisify(child_process.exec);
const asyncGlob = promisify(glob);
const readline = require('readline');

const maxBuffer = 10 * 1024 * 1024;
const globPattern = 'examples/lux/stdlib/source/**/*.lux';

function countText(singular, array) {
  return array.length === 1 ? `${array.length} ${singular}` : `${array.length} ${singular}s`;
}

(async function main() {
  try {
    const files = await asyncGlob(globPattern);

    function pad(index) {
      return [...Array(files.length.toString().length - index.toString().length).keys()].map(() => ' ').join('') + index;
    };

    console.log(`parsing ${countText('file', files)}\n`);

    const parseErrors = [];
    for (var index = 0; index < files.length; index++){
      const file = files[index];
      try {
        const processingFileString = `\u25CB ${pad(index + 1)} / ${files.length} parsing ${file} ...`;
        process.stdout.write(processingFileString);
        await exec('./node_modules/.bin/tree-sitter parse ' + file, { maxBuffer });
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);
        process.stdout.write(`\u2713 ${pad(index + 1)} / ${files.length} parsed ${file}\n`);
      }
      catch (error) {
        if (!error.stdout) {
          throw error;
        }
        var fileErrors = error.stdout.match(/\(ERROR \[(\d+), (\d+)\] - \[(\d+), (\d+)\]\)/g);
        fileErrors.pop();

        let errorObject = { file: file, errors: [] };
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);
        process.stdout.write(`\u2715 ${pad(index + 1)} / ${files.length} ${countText('error', fileErrors)} in ${file}\n`);
        for (const fileError of fileErrors) {
          const { start_line, start_character, end_line, end_character } = fileError.match(/\(ERROR \[(?<start_line>\d+), (?<start_character>\d+)\] - \[(?<end_line>\d+), (?<end_character>\d+)\]\)/).groups;

          const error = `line${start_line === end_line ? '' : 's'} ${start_line === end_line ? parseInt(start_line) + 1 : start_line + '-' + end_line}, columns ${start_character}-${end_character}`
          errorObject.errors.push(error);
          console.log(`            ${error}`)
        }
        parseErrors.push(errorObject);
      }
    }

    console.log("\n====================================================\n");

    if (parseErrors.length > 0) {
      console.log(`parsed ${countText('file', files)}, errors in ${countText('file', parseErrors)} \n`);
      for (const { file, errors } of parseErrors) {
        console.log(`${countText('error', errors)} in ${file}`);
        for (const error of errors) {
          console.log(`  ${error}`);
        }
        console.log();
      }
      process.exit(1);
    }
    else {
      console.log(`successfully parsed ${countText('file', files)}!`)
      process.exit(0);
    }
  }
  catch (e) {
    console.error(e);
    process.exit(1);
  }

})();
