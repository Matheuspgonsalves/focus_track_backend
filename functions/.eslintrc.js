module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/src/__tests__postman/**/*",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "@typescript-eslint/no-explicit-any": "off",
    "max-len": ["error", {"code": 240}],
    "require-jsdoc": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "camelcase": "off",
    "no-extend-native": "off",
    "linebreak-style": ["error", "unix"], // 'unix' = LF, 'windows' = CRLF
  },
};
