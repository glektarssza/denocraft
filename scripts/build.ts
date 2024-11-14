//-- jsr.io
import * as path from 'jsr:@std/path';

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
    .scriptName('build')
    .usage('$0 - Build the project')
    .epilog("Copyright (c) 2024 G'lek Tarssza, all rights reserved.")
    .help('help', 'Display help information and then exit.', true)
    .alias('help', 'h')
    .version('version', 'Display version information and then exit.', '0.0.0')
    .alias('version', 'v')
    .env('DENOCRAFT_BUILD')
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
        description: 'The target(s) to build.',
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
        logging.logInfo('Building project...');
        if (args.target.includes('all')) {
            args.target = buildTarget.getAllBuildTargets();
        }
        logging.logVerbose(`Selected target(s): ${args.target}`);
        const ps = args.target.map(async (target: string): Promise<void> => {
            if (!buildTarget.isValidBuildTargetOrSpecialBuildTarget(target)) {
                throw new Error(`Invalid target: ${target}`);
            }
            if (target === 'current') {
                target = buildTarget.getBuildTargetFromCurrent();
            } else if (target === 'dev' || target === 'development') {
                target = buildTarget.getBuildTargetFromCurrent(
                    buildTarget.BuildType.Development,
                );
            } else if (target === 'release') {
                target = buildTarget.getBuildTargetFromCurrent(
                    buildTarget.BuildType.Release,
                );
            }
            if (!buildTarget.isValidBuildTarget(target)) {
                throw new Error(`Invalid target: ${target}`);
            }
            logging.logVerbose(`Building target ${target}...`);
            const mainModule = buildTarget.getMainModulePath(
                buildTarget.getBuildType(target),
            );
            const outputDir = buildTarget.getOutputPath(target);
            const outputPath = path.join(outputDir, 'denocraft');
            const cmd = new Deno.Command('deno', {
                args: [
                    'compile',
                    '--output',
                    outputPath,
                    '--target',
                    buildTarget.mapToDenoTarget(target),
                    '--allow-ffi',
                    '--allow-read',
                    '--unstable-webgpu',
                    mainModule,
                ],
            });
            const status = await cmd.output();
            if (!status.success) {
                throw new Error(
                    `Failed to build target ${target} (exit code: ${status.code})`,
                );
            }
            logging.logVerbose(`Built target ${target}`);
        });
        await Promise.all(ps);
        logging.logInfo('Project built');
        console.log(chalk.greenBright('Success!'));
    })
    .catch((err: Error): void => {
        console.error(chalk.redBright('Fatal error!'));
        console.error(chalk.redBright(err));
    });
