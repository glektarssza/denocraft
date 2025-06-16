module.exports = {
    extension: ['ts'],
    jobs: 1,
    parallel: false,
    recursive: true,
    reporter: 'spec',
    spec: ['./tests/**/*.spec.ts'],
    ui: 'bdd'
};
