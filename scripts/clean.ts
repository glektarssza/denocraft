/**
 * A script which provides a way to clean the project.
 *
 * @module
 */

//-- JSR
import { parseArgs } from 'jsr:@std/cli';
import * as path from 'jsr:@std/path';

//-- NPM
import chalk from 'npm:chalk';

//-- Project Code
import { logging, targets } from './lib/mod.ts';

/**
 * Log a fatal error and then exit.
 *
 * @param err - The fatal error that occurred.
 */
function fatalError(err?: Error): never {
    console.error(chalk.redBright('Fatal error!'));
    if (err !== undefined) {
        console.error(err);
    }
    Deno.exit(1);
}

try {
    /**
     * The current operating system.
     */
    const currentOS = targets.getCurrentOperatingSystem();

    /**
     * The name of the current operating system.
     */
    const currentOSName = targets.OperatingSystem[currentOS].toLowerCase();

    /**
     * The current CPU architecture.
     */
    const currentCPU = targets.getCurrentCPUArchitecture();

    /**
     * The name of the current CPU architecture.
     */
    const currentCPUName = targets.CPUArchitecture[currentCPU].toLowerCase();

    /**
     * The parsed command-line arguments.
     */
    const args = parseArgs(Deno.args, {
        boolean: ['verbose', 'version', 'help', 'dev', 'all'],
        string: ['target', 'os', 'cpu'],
        alias: {
            help: ['h'],
            verbose: ['v'],
        },
        default: {
            os: currentOSName,
            cpu: currentCPUName,
        },
    });

    logging.setVerboseLoggingEnabled(args.verbose);

    if (args.help) {
        console.log('Usage: clean [options]');
        console.log('Clean the project.');
        console.log();
        console.log('== General ==');
        console.log();
        console.log('  --help, -h\t\tDisplay the help information and exit.');
        console.log('  --version\t\tDisplay the version information and exit.');
        console.log();
        console.log('== Targeting ==');
        console.log();
        console.log(
            `  --os\t\t\tThe operating system to target.\t\t\t\t\t[default: ${currentOSName}]`,
        );
        console.log(
            `  --cpu\t\t\tThe CPU architecture to target.\t\t\t\t\t[default: ${currentCPUName}]`,
        );
        console.log(
            '  --target\t\tThe platform to target. Overrides the `--os` and `--cpu` flags.',
        );
        console.log(
            '  --all\t\t\tTarget all platforms. Overrides the `--os`, `--cpu`, and `--target` flags.',
        );
        console.log();
        console.log('== Logging ==');
        console.log();
        console.log('  --verbose, -v\t\tEnable verbose logging.');
        console.log();
        console.log("Copyright (c) 2024 G'lek Tarssza, all rights reserved.");
        Deno.exit(0);
    }

    if (args.version) {
        console.log('v0.0.1');
        Deno.exit(0);
    }

    const target: targets.BuildTarget = {
        os: currentOS,
        cpu: currentCPU,
    };
    if (args.target !== undefined) {
        const [rawOS, rawCPU] = args.target.split('-');
        if (!rawOS) {
            throw new Error(
                `Invalid target argument "${args.target}" (operating system not specified)`,
            );
        }
        if (!rawCPU) {
            throw new Error(
                `Invalid target argument "${args.target}" (CPU architecture not specified)`,
            );
        }
        target.os = targets.parseOperatingSystem(rawOS);
        target.cpu = targets.parseCPUArchitecture(rawCPU);
    } else {
        target.os = targets.parseOperatingSystem(args.os);
        target.cpu = targets.parseCPUArchitecture(args.cpu);
    }

    if (args.all) {
        logging.logInfo(
            `Starting clean for all projects`,
        );
    } else {
        logging.logInfo(
            `Starting clean for "${
                targets.OperatingSystem[target.os].toLowerCase()
            }-${targets.CPUArchitecture[target.cpu].toLowerCase()}"`,
        );
    }

    let output: string;
    if (args.all) {
        output = path.relative(
            Deno.cwd(),
            path.resolve(
                import.meta.dirname!,
                `../dist`,
            ),
        );
    } else {
        output = path.relative(
            Deno.cwd(),
            path.resolve(
                import.meta.dirname!,
                `../dist/${currentOSName}/${currentCPUName}`,
            ),
        );
    }

    if (args.dev) {
        output = path.resolve(
            output,
            'denocraft-dev',
        );
    }

    logging.logVerbose('Cleaning project(s)...');
    try {
        Deno.removeSync(output, { recursive: true });
    } catch (err) {
        logging.logWarning(`Could not clean project`);
        logging.logVerbose(err);
    }
    logging.logVerbose('Cleaned project(s)');
} catch (err) {
    fatalError(err instanceof Error ? err : undefined);
}
