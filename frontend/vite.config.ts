import * as path from "path";
import { defineConfig, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const alias = {
    "@": path.resolve(__dirname, "src")
};

export default defineConfig(({ command }) => {
    const config: UserConfig = {
        plugins: [vue()],
        resolve: {
            alias
        },
        server: {
            host: "127.0.0.1",
            port: 8080
        }
    };

    if (command === "build") {
        config.base = "/static/";
    }

    return config;
});
