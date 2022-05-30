import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ApiService from "@/services/api.service";

ApiService.init(import.meta.env.VITE_BACKEND_HOST as string);

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.mount("#app");

