// deno-lint-ignore-file no-top-level-await no-non-null-assertion

//-- jsr.io
import * as path from 'jsr:@std/path';

//-- npm.com
import chalk from 'npm:chalk';
// @deno-types='npm:@types/yargs'
import yargs from 'npm:yargs';

//-- Project Code
import {
    setVerbose,
    writeError,
    writeInfo,
    writeVerbose,
    writeWarning,
} from './logging.ts';

/**
 * The argument parser.
 */
const parser = yargs(Deno.args)
    .scriptName('clean')
    .usage('$0 - Clean the project')
    .epilog("Copyright (c) 2024 G'lek Tarssza, all rights reserved.")
    .help('help', 'Display help information and then exit.', true)
    .alias('help', 'h')
    .version('version', 'Display version information and then exit.', '0.0.0')
    .alias('version', 'v')
    .env('DENOCRAFT_CLEAN')
    .strict()
    .strictCommands(true)
    .strictOptions(true)
    .fail(false)
    .completion(
        'completion',
        'Generate a completion script for the shell.',
    )
    .option('verbose', {
        type: 'boolean',
        description: 'Whether to enable verbose logging.',
        global: true,
        default: false,
        group: 'Logging',
    })
    .option('target', {
        type: 'array',
        string: true,
        description: 'The target to clean.',
        demandOption: true,
        nargs: 1,
        requiresArg: true,
        global: true,
        default: [
            'linux-x64',
            'linux-aarch64',
            'win-x64',
            'macos-x64',
            'macos-aarch64',
        ],
        group: 'Target',
    });

await parser.parseAsync()
    .then(async (args): Promise<void> => {
        setVerbose(args.verbose);
        writeInfo('Cleaning project...');
        writeVerbose(`Target(s): ${args.target}`);
        const ps = args.target.map(async (target: string): Promise<void> => {
            try {
                await Deno.remove(
                    path.join(import.meta.dirname!, '../dist', target),
                    {
                        recursive: true,
                    },
                );
            } catch (ex) {
                if (ex instanceof Deno.errors.NotFound) {
                    writeWarning(
                        `Target ${target} not found - has it been built?`,
                    );
                    return;
                }
                writeError(`Failed to clean target ${target}`);
                throw ex;
            }
        });
        await Promise.all(ps);
        writeInfo('Project cleaned.');
        console.log(chalk.greenBright('Success!'));
    })
    .catch((err: Error): void => {
        console.error(chalk.redBright('Fatal error!'));
        console.error(chalk.redBright(err));
    });
