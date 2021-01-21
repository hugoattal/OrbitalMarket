import "@/database/test";
import { db } from "@/database";
import * as ConfigService from "./service";
import * as Migrate from "@/database/migration/utils/migrate";

describe("config/service", () => {
    describe("doesConfigExist()", () => {
        test("should return false is there's no config collection", async () => {
            await db.dropDatabase();

            const doesConfigExist = await ConfigService.doesConfigExist("migration");

            expect(doesConfigExist).toBeFalsy();
        });
        test("should return true is there's a config collection", async () => {
            await db.dropDatabase();
            await Migrate.applyMigration(0);

            const doesConfigExist = await ConfigService.doesConfigExist("migration");

            expect(doesConfigExist).toBeTruthy();
        });
    });
});
