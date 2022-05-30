/// <reference types="vitest" />

import * as path from "path";
import { defineConfig, UserConfig } from "vite";

const alias = {
    "@": path.resolve(__dirname, "src")
};

export default defineConfig(() => {
    const config: UserConfig = {
        resolve: {
            alias
        }
    };

    config.test = {
        globals: true,
        coverage: {
            enabled: false
        }
    };

    return config;
});
