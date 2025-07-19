import * as ConfigService from "@/modules/config/service";
import { getConfigData } from "@/modules/config/service";

export async function getSavedState<T>(name: string, defaultValue: T = 0) {
    let currentState = defaultValue;

    if (await ConfigService.doesConfigExist(name)) {
        currentState = (await getConfigData(name)).state;
    }
    else {
        await ConfigService.createConfig(name, { state: defaultValue });
    }

    return currentState;
}

export async function setSavedState(name: string, state: unknown) {
    await ConfigService.updateConfigData(name, { state });
}
