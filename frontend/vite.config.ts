import * as path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const alias = {
    "@": path.resolve(__dirname, "src")
};

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias
    },
    server: {
        port: 8080
    }
});
