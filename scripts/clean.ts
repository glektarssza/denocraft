//-- npm.com
import chalk from 'npm:chalk';
// @deno-types='npm:@types/yargs'
import yargs from 'npm:yargs';

//-- Project Code
import { buildTarget, logging } from './lib/mod.ts';

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
        description: 'The target(s) to clean.',
        demandOption: true,
        nargs: 1,
        requiresArg: true,
        global: true,
        default: buildTarget.getDefaultBuildTargets(),
        group: 'Targeting',
    });

// deno-lint-ignore no-top-level-await
await parser.parseAsync()
    .then(async (args): Promise<void> => {
        logging.setOutputVerboseLogs(args.verbose);
        logging.logInfo('Cleaning project...');
        logging.logVerbose(`Selected target(s): ${args.target}`);
        const ps = args.target.map(async (target: string): Promise<void> => {
            if (!buildTarget.isValidBuildTarget(target)) {
                throw new Error(`Invalid target: ${target}`);
            }
            logging.logVerbose(`Cleaning target ${target}...`);
            try {
                await Deno.remove(
                    buildTarget.getOutputPath(target),
                    {
                        recursive: true,
                    },
                );
            } catch (ex) {
                if (ex instanceof Deno.errors.NotFound) {
                    logging.logWarning(
                        `Target ${target} not found - has it been built?`,
                    );
                    return;
                }
                logging.logError(`Failed to clean target ${target}`);
                throw ex;
            }
            logging.logVerbose(`Cleaned target ${target}`);
        });
        await Promise.all(ps);
        logging.logInfo('Project cleaned');
        logging.getOutputFunction(logging.LoggingLevel.Info)(
            chalk.greenBright('Success!'),
        );
    })
    .catch((err: Error): void => {
        logging.getOutputFunction(logging.LoggingLevel.Error)(
            chalk.redBright('Fatal error!'),
        );
        logging.getOutputFunction(logging.LoggingLevel.Error)(
            chalk.redBright(err),
        );
    });
