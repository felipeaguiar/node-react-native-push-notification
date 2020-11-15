const sqlFormatter = require('sql-formatter');
const fs = require('fs');

const file = process.argv[2];
let newFile = '';

const texto = fs.readFileSync(file, 'utf8');

const lines = texto.split('\n');
lines.forEach((line) => {

  if (!newFile) {
    newFile = line;
    return;
  }

  const values = line.match(/\s*await queryRunner.query\(["'](.*)["']\);/);

  if (Array.isArray(values) && values.length) {
    let sql = sqlFormatter.format(values[1]);

    sql = sql.replace(/`/g, '');
    sql = sql.replace(/\n/g, '\n      ');

    newFile = newFile + `\n    await queryRunner.query(\`\n      ${sql}\`\n    );\n`;
  } else {
    newFile = newFile + '\n' + line;
  }
});

fs.writeFileSync(`${file}-new.ts`, newFile);
