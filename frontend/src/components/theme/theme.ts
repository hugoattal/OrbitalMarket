import { useDark, useToggle } from "@vueuse/core";

export const isDarkMode = useDark({
    attribute: "data-theme",
    selector: "html",
    valueDark: "dark",
    valueLight: "light"
});

export const toggleDarkMode = useToggle(isDarkMode);
