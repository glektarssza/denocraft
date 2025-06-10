export function getNativePrefix(): string {
    switch (Deno.build.os) {
        case 'windows':
            return '';
        case 'darwin':
        case 'linux':
            return 'lib';
        default:
            throw new Error(`Unsupported OS "${Deno.build.os}"`);
    }
}
