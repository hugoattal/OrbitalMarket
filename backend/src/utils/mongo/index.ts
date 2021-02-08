export function isInRange(field: string, min: number, max: number): Record<string, any> {
    return {
        [field]: { $lte: max, $gte: min }
    };
}

export function isRangeInRange(fieldMin: string, fieldMax: string, min: number, max: number): Record<string, any> {
    return {
        [fieldMin]: { $lte: max },
        [fieldMax]: { $gte: min }
    };
}
