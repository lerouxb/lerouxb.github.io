/**
 * ts-to-zod configuration.
 *
 * @type {import("ts-to-zod").TsToZodConfig}
 */
module.exports = [
  {
    name: 'types',
    input: 'src/types.ts',
    output: 'src/types.zod.ts',
  },
];
