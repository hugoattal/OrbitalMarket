export default {
    isDarkMode(){
        if (localStorage.getItem("theme")) {
            return localStorage.getItem("theme") === "dark";
        }

        return !!window?.matchMedia("(prefers-color-scheme: dark)").matches;
    },
    update(isDarkMode: boolean){
        const theme = isDarkMode ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }
};
