import lpConfigTs from "@luna-park/eslint-config/typescript";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/dist/*"]
    },
    ...lpConfigTs,
    {
        rules: {
            "sort-keys-custom-order/object-keys": ["error", {
                orderedKeys: ["id", "name", "title"]
            }],
            "sort-keys-custom-order/type-keys": ["error", {
                orderedKeys: ["id", "name", "title"]
            }]
        }
    }
);
