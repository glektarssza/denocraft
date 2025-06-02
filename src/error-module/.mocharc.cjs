//-- NodeJS
const os = require('node:os');
const process = require('node:process');

//-- NPM Packages
const chalk = require('chalk');

/**
 * The maximum number of parallel jobs to use.
 */
const jobs = Math.max(1, os.cpus().length / 2);

/**
 * Whether parallel processing is enabled.
 */
const parallel = ((process.env['CI'] ?? '') && false) || jobs > 1;

if (!/^(false|0|)$/.test(process.env['MOCHA_DEBUG'] ?? ''))
    console.debug(
        `[${chalk.default.ansi256(213)('DEBUG')}] Running in ${
            parallel ? '' : 'non-'
        }parallel mode${parallel ? ` with ${jobs} jobs` : ''}`
    );

module.exports = {
    extends: '../../.mocharc.cjs',
    spec: ['./tests/*.spec.ts', './tests/**/*.spec.ts'],
    require: ['source-map-support/register'],
    extension: ['.ts'],
    recursive: true,
    enableSourceMaps: true,
    ui: 'bdd',
    parallel,
    jobs
};
