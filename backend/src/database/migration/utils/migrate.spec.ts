import "@/database/test";
import * as Migrate from "./migrate";
import { db } from "@/database";

describe("Migrations", () => {
    describe("getMigrationFile()", () => {
        test("should return false is there's no config collection", async () => {
            const migrationFile = Migrate.getMigrationFile(0);

            expect(migrationFile).toBe("0000_createMigrationConfig.ts");
        });
    });

    describe("doesConfigExist()", () => {
        beforeEach(async() => {
            await db.dropDatabase();
        });

        test("should return false is there's no config collection", async () => {
            const doesConfigExist = await Migrate.getCurrentMigrationId();

            expect(doesConfigExist).toBe(-1);
        });

        test("should return true is there's a config collection", async () => {
            await Migrate.applyMigration(0);

            const doesConfigExist = await Migrate.getCurrentMigrationId();

            expect(doesConfigExist).toBe(0);
        });

        afterAll(async() => {
            await Migrate.migrateToLatest();
        });
    });
});
