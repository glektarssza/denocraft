module.exports = {
    spec: ['./tests/*.spec.ts', './tests/**/*.spec.ts'],
    require: ['source-map-support/register'],
    extension: ['.ts'],
    recursive: true,
    enableSourceMaps: true,
    parallel: true,
    exit: true,
    ui: 'bdd'
};
