import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ApiService from "@/services/api.service";

ApiService.init(import.meta.env.VITE_BACKEND_HOST as string);

createApp(App)
    .use(router)
    .mount("#app");
