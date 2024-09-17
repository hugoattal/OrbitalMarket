import * as ConfigService from "@/modules/config/service";
import { getConfigData } from "@/modules/config/service";

export async function getSavedState(name: string) {
    let currentState = 0;

    if (await ConfigService.doesConfigExist(name)) {
        currentState = (await getConfigData(name)).state;
    }
    else {
        await ConfigService.createConfig(name, { state: 0 });
    }

    return currentState;
}

export async function setSavedState(name: string, state: number) {
    await ConfigService.updateConfigData(name, { state });
}
