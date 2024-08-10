import pluginVue from "eslint-plugin-vue";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginPromise from "eslint-plugin-promise";
import sortKeysCustomOrder from "eslint-plugin-sort-keys-custom-order";
import pluginImportX from "eslint-plugin-import-x";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default tseslint.config(
    {
        ignores: ["**/dist/*"]
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    ...pluginVue.configs["flat/recommended"],
    pluginPromise.configs["flat/recommended"],
    sortKeysCustomOrder.configs["flat/recommended"],
    ...compat.config(pluginImportX.configs.recommended),
    {
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                sourceType: "module"
            }
        },
        rules: {
            "@typescript-eslint/array-type": ["error", { default: "generic", readonly: "generic" }],
            "@typescript-eslint/consistent-type-definitions": ["off"],
            "@typescript-eslint/no-empty-function": ["off"],
            "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "props|emits" }],
            "array-bracket-spacing": ["error", "never"],
            "arrow-spacing": ["error"],
            "brace-style": ["error", "stroustrup"],
            "comma-dangle": ["error", "never"],
            "comma-spacing": ["error"],
            "eol-last": ["error", "always"],
            "eqeqeq": ["error", "always"],
            "import-x/no-named-as-default-member": ["off"],
            "indent": ["error", 4],
            "key-spacing": ["error"],
            "keyword-spacing": ["error"],
            "no-multi-spaces": ["error"],
            "object-curly-spacing": ["error", "always"],
            "prefer-template": "error",
            "quotes": ["error", "double", {
                "allowTemplateLiterals": true
            }],
            "semi": ["error", "always"],
            "sort-keys-custom-order/export-object-keys": ["error"],
            "sort-keys-custom-order/import-object-keys": ["error"],
            "sort-keys-custom-order/object-keys": ["error", {
                "orderedKeys": ["id", "name", "title"]
            }],
            "sort-keys-custom-order/type-keys": ["error", {
                "orderedKeys": ["id", "name", "title"]
            }],
            "space-in-parens": ["error", "never"],
            "space-infix-ops": ["error"],
            "template-curly-spacing": ["error", "always"],
            "vue/attributes-order": ["error", {
                "alphabetical": true
            }],
            "vue/html-indent": ["error", 4],
            "vue/no-mutating-props": ["off"],
            "vue/no-v-html": ["off"],
            "vue/no-v-text-v-html-on-component": ["error", { "allow": ["component"] }],
            "vue/require-default-prop": ["off"]
        },
        settings: {
            "import-x/parsers": {
                "@typescript-eslint/parser": [".ts", ".tsx"]
            },
            "import-x/resolver": {
                "typescript": "eslint-import-resolver-typescript"
            }
        }
    }
);
