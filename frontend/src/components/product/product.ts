import { format } from "date-fns";

export function displayPrice (price: number): string {
    return `$${(price / 100).toFixed(2)}`;
}

export function displayDate (date: string): string {
    return format(new Date(date), "dd/MM/yy");
}

export function displayEngineVersion (engine: {min?: [number, number], max?: [number, number]}): string {
    if (engine && engine.min && engine.max) {
        return `${engine.min[0]}.${engine.min[1]}-${engine.max[0]}.${engine.max[1]}`;
    }
    else {
        return "None";
    }
}
