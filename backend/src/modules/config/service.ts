import ConfigModel, { IConfig } from "./model";

export async function createConfig(name: string, data: any) {
    await ConfigModel.create({ name, data });
}

export async function deleteConfig(name: string) {
    await ConfigModel.deleteOne({ name });
}

export async function doesConfigExist(name: string): Promise<boolean> {
    const config = await ConfigModel.find({ name }).exec();
    return config.length > 0;
}

export async function getConfigData(name: string): Promise<any> {
    const config = await ConfigModel.findOne({ name }).exec() as IConfig;
    return config.data;
}

export async function updateConfigData(name: string, data: any) {
    await ConfigModel.updateOne({ name }, { data }).exec();
}
