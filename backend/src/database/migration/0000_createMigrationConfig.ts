import * as ConfigService from "@/modules/config/service";

export async function up(): Promise<void> {
    await ConfigService.createConfig("migration", { stage: 0 });
}

export async function down(): Promise<void> {
    await ConfigService.deleteConfig("migration");
}
