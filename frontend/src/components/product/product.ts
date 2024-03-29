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

export function displayCategory (category: string) {

    if (!category) {
        return "unknown";
    }

    if (category.startsWith("music")) {
        return `🎵 ${ category }`;
    }

    if (category.startsWith("codeplugins")) {
        return `⚙️ ${ category }`;
    }

    if (category.startsWith("blueprints")) {
        return `📘 ${ category }`;
    }

    if (category.startsWith("props")) {
        return `🚗 ${ category }`;
    }

    if (category.startsWith("environment")) {
        return `🏝️ ${ category }`;
    }

    if (category.startsWith("materials") || category.startsWith("textures")) {
        return `🎨 ${ category }`;
    }

    if (category.startsWith("fx")) {
        return `✨ ${ category }`;
    }

    if (category.startsWith("animations")) {
        return `🏃 ${ category }`;
    }

    if (category.startsWith("characters")) {
        return `🕺 ${ category }`;
    }

    return category;
}
