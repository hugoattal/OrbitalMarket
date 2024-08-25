import * as ConfigService from "@/modules/config/service";
import { getConfigData } from "@/modules/config/service";

export async function getSavedState() {
    let currentState = 0;

    if (await ConfigService.doesConfigExist("product")) {
        currentState = (await getConfigData("product")).state;
    }
    else {
        await ConfigService.createConfig("product", { state: 0 });
    }

    return currentState;
}

export async function setSavedState(state: number) {
    await ConfigService.updateConfigData("product", { state });
}
