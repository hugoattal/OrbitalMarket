import fs from "fs";
import * as ConfigService from "@/modules/config/service";
import { getConfigData } from "@/modules/config/service";

export function getMigrationFiles() {
    let files = fs.readdirSync(__dirname + "/..");
    files = files.filter((fileName) => fileName.endsWith(".ts"));
    return files;
}

export function getMigrationFile(id: number) {
    const stringId = id.toString().padStart(4, "0");
    let files = getMigrationFiles();
    files = files.filter((fileName) => fileName.startsWith(stringId));
    return files[0];
}

export async function applyMigration(id: number) {
    const migrationFileName = "../" + getMigrationFile(id);
    const Migration = await import(migrationFileName);
    await Migration.up();
}

export function getLatestMigrationId(): number {
    let files = fs.readdirSync(__dirname + "/..");
    files = files.filter((fileName) => fileName.endsWith(".ts"));
    return parseInt(files.pop() as string);
}

export async function getCurrentMigrationId(): Promise<number> {
    let currentState = -1;

    if (await ConfigService.doesConfigExist("migration")) {
        currentState = (await getConfigData("migration")).stage;
    }

    return currentState;
}

export async function migrateToLatest() {
    let migrationStartId = await getCurrentMigrationId() + 1;
    let migrationEndId = getLatestMigrationId();

    for (let migrationId = migrationStartId; migrationId < migrationEndId; migrationId++) {
        await applyMigration(migrationId);
    }

    await ConfigService.updateConfigData("migration", { stage: migrationEndId });
}
