import { format } from "date-fns";

export function displayPrice (price: number): string {
    return `$${(price / 100).toFixed(2)}`;
}

export function displayDate (date: string): string {
    return format(new Date(date), "dd/MM/yy");
}
