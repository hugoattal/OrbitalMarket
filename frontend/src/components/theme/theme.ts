import StorageModule from "@/modules/storage.module";

export default {
    isDarkMode () {
        const isDefaultDark = !!window?.matchMedia("(prefers-color-scheme: dark)").matches;
        const defaultTheme = isDefaultDark ? "dark" : "light";

        return StorageModule.getElement("theme", defaultTheme);
    },
    update (isDarkMode: boolean) {
        const theme = isDarkMode ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        StorageModule.setElement("theme", theme);
    }
};
