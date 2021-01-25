module.exports = {
    env: {
        browser: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended",
        "@vue/standard",
        "@vue/typescript/recommended"
    ],
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2020
    },
    plugins: [
        "@typescript-eslint"
    ],
    root: true,
    rules: {
        "brace-style": ["error", "stroustrup"],
        "comma-dangle": ["error", "never"],
        "eol-last": ["error", "always"],
        eqeqeq: ["error", "always"],
        indent: ["error", 4],
        "keyword-spacing": ["error"],
        "object-curly-spacing": ["error", "always"],
        "prefer-template": "error",
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "space-infix-ops": ["error"],
        "vue/html-indent": ["error", 4],
        "vue/no-multiple-template-root": "off",
        "@typescript-eslint/no-explicit-any": "off"
    }
};
