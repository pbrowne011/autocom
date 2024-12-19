export default {
  files: ["src/test/**/*.test.ts"],
  mocha: {
    ui: 'tdd',
    require: ['ts-node/register']
  }
};
