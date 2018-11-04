module.exports = {
    env: {
        node: true,
        es6: true,
        jest: true
    },
    parser: "babel-eslint",
    extends: "eslint:recommended",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018
    },
    plugins: ["react"],
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "windows"],
        quotes: ["error", "double"],
        eqeqeq: "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": ["error", "always"],
        "arrow-spacing": ["error", { before: true, after: true }],
        "no-console": 0
    },
    parserOptions: {
        ecmaVersion: 2018
    }
};
