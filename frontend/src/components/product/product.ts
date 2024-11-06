import { format } from "date-fns";

export function displayPrice (price: number): string {
    if (price === 0) {
        return "Free";
    }
    return `$${ (price / 100).toFixed(2) }`;
}

export function displayDate (date: string): string {
    return format(new Date(date), "dd/MM/yy");
}

export function displayEngineVersion (engine: {max?: string; min?: string}): string {
    if (engine && engine.min && engine.max) {
        return `${ makeSemVer(engine.min) }-${ makeSemVer(engine.max) }`;
    }
    else {
        return "None";
    }
}

export function makeSemVer(version: string) {
    return version
        .split(".")
        .map((element) => parseInt(element))
        .join(".");
}

export function displayCategoryEmoji (category: string) {
    if (!category) {
        return "❓";
    }

    if (category.startsWith("audio")) {
        return "🎵";
    }

    if (category.startsWith("tool-and-plugin")) {
        return "⚙️";
    }

    if (category.startsWith("ui")) {
        return "🖼️";
    }

    if (category.startsWith("3d-model")) {
        return "🚗";
    }

    if (category.startsWith("2d-asset")) {
        return "🎨";
    }

    if (category.startsWith("environment")) {
        return "🏝️";
    }

    if (category.startsWith("material") || category.startsWith("texture")) {
        return "🎨";
    }

    if (category.startsWith("game-system") || category.startsWith("game-template")) {
        return "🕹️";
    }

    if (category.startsWith("fx") || category.startsWith("vfx")) {
        return "✨";
    }

    if (category.startsWith("animation")) {
        return "🏃";
    }

    if (category.startsWith("smart-asset")) {
        return "🕺";
    }

    return "❓";
}

export function displayCategory (category: string) {

    if (!category) {
        return "unknown";
    }

    if (category.startsWith("audio")) {
        return `🎵 ${ category }`;
    }

    if (category.startsWith("tool-and-plugin")) {
        return `⚙️ ${ category }`;
    }

    if (category.startsWith("ui")) {
        return `👓 ${ category }`;
    }

    if (category.startsWith("3d-model")) {
        return `🚗 ${ category }`;
    }

    if (category.startsWith("2d-asset")) {
        return `🖼️ ${ category }`;
    }

    if (category.startsWith("environment")) {
        return `🏝️ ${ category }`;
    }

    if (category.startsWith("material") || category.startsWith("texture")) {
        return `🎨 ${ category }`;
    }

    if (category.startsWith("game-system") || category.startsWith("game-template")) {
        return `🕹️ ${ category }`;
    }

    if (category.startsWith("fx") || category.startsWith("vfx")) {
        return `✨ ${ category }`;
    }

    if (category.startsWith("animation")) {
        return `🏃 ${ category }`;
    }

    if (category.startsWith("smart-asset")) {
        return `🕺 ${ category }`;
    }

    return category;
}
