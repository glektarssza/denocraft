// deno-lint-ignore-file no-non-null-assertion
/**
 * A script which provides a way to build the project.
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
     * The default path to store build outputs in.
     */
    const defaultOutput = path.relative(
        Deno.cwd(),
        path.resolve(
            import.meta.dirname!,
            `../dist/${currentOSName}/${currentCPUName}`,
        ),
    );

    /**
     * The parsed command-line arguments.
     */
    const args = parseArgs(Deno.args, {
        boolean: ['verbose', 'version', 'help', 'dev'],
        string: ['target', 'os', 'cpu', 'output'],
        alias: {
            help: ['h'],
            verbose: ['v'],
            output: ['o'],
        },
        default: {
            os: currentOSName,
            cpu: currentCPUName,
            output: defaultOutput,
        },
    });

    logging.setVerboseLoggingEnabled(args.verbose);

    if (args.help) {
        console.log('Usage: build [options]');
        console.log('Build the project.');
        console.log();
        console.log('== General ==');
        console.log();
        console.log('  --help, -h\t\tDisplay the help information and exit.');
        console.log('  --version\t\tDisplay the version information and exit.');
        console.log();
        console.log('== Output ==');
        console.log();
        console.log(
            `  --output, -o\t\t\tThe destination to store the resulting build in.\t\t[default: ${defaultOutput}]`,
        );
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

    logging.logInfo(
        `Starting build for "${
            targets.OperatingSystem[target.os].toLowerCase()
        }-${targets.CPUArchitecture[target.cpu].toLowerCase()}"`,
    );

    const denoTarget = targets.mapBuildTargetToDenoTarget(target);

    logging.logVerbose(`Using Deno target "${denoTarget}"`);

    const input = path.resolve(
        import.meta.dirname!,
        args.dev ? '../src/dev.ts' : '../src/main.ts',
    );
    const output = path.resolve(
        Deno.cwd(),
        args.output,
    );

    logging.logVerbose('Ensuring output directory exists...');
    Deno.mkdirSync(output, { recursive: true });

    logging.logVerbose('Building project...');

    const sig = new AbortController();
    if (Deno.build.os === 'windows') {
        Deno.addSignalListener('SIGBREAK', (): void => {
            sig.abort();
        });
    } else {
        Deno.addSignalListener('SIGTERM', (): void => {
            sig.abort();
        });
    }
    Deno.addSignalListener('SIGINT', (): void => {
        sig.abort();
    });

    const proc = new Deno.Command(Deno.execPath(), {
        args: [
            'compile',
            '--output',
            `${output}/denocraft${args.dev ? '-dev' : ''}`,
            '--target',
            denoTarget,
            input,
        ],
        signal: sig.signal,
    });
    const childProc = proc.spawn();
    childProc.ref();
    childProc.status.then(({ success, code }): void => {
        logging.logVerbose('Built project');
        if (!success) {
            fatalError(new Error(`Deno exited with status code "${code}"`));
        }
        console.log(chalk.greenBright('Success!'));
    }).catch((err): void => {
        fatalError(err instanceof Error ? err : undefined);
    });
} catch (err) {
    fatalError(err instanceof Error ? err : undefined);
}
