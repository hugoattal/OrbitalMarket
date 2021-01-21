module.exports = {
    env: {
        "browser": true,
        "node": true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        "parser": "babel-eslint"
    },
    plugins: [
        "@typescript-eslint"
    ],
    root: true,
    rules: {
        "array-bracket-spacing": ["error", "never"],
        "brace-style": ["error", "stroustrup"],
        "comma-dangle": ["error", "never"],
        "eol-last": ["error", "always"],
        "eqeqeq": ["error", "always"],
        "indent": ["error", 4],
        "keyword-spacing": ["error"],
        "object-curly-spacing": ["error", "always"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "key-spacing": ["error", { "beforeColon": false, "afterColon": true, mode: "strict" }],
        "space-infix-ops": ["error"]
    }
};

