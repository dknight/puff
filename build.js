import {
  writeFileSync,
  createReadStream,
  createWriteStream,
  statSync,
} from 'node:fs';
import path from 'node:path';
import {createGzip} from 'node:zlib';
import {promisify} from 'node:util';
import {pipeline} from 'node:stream';

import browserslist from 'browserslist';
import {browserslistToTargets, bundle, Features} from 'lightningcss';

const srcDir = 'src';
const distDir = 'dist';
const inputFile = 'kerge.css';
const outputFile = 'kerge.min.css';
const input = path.join('.', srcDir, inputFile);
const output = path.join('.', distDir, outputFile);

const targets = browserslistToTargets(browserslist('>= 0.25%'));

const {code} = bundle({
  filename: input,
  minify: true,
  include: Features.Colors,
  targets,
});

writeFileSync(output, code);

const zip = async (input, output) => {
  const gzip = createGzip({
    level: 9,
  });
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  const pipe = promisify(pipeline);
  await pipe(source, gzip, destination);
  const insize = statSync(input).size;
  const outsize = statSync(output).size;
  return Promise.resolve([insize, outsize]);
};

zip(output, `${output}.gz`)
  .then((sizes) => {
    console.log(`Normal: ${sizes[0]} bytes`);
    console.log(`Gzip: ${sizes[1]} bytes`);
  })
  .catch((err) => {
    console.error(`Cannot zip file: ${err}`);
    process.exit(1);
  });
