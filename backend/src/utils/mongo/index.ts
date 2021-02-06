export function isRangeInRange(fieldMin: string, fieldMax: string, min: number, max: number): Record<string, any> {
    return {
        [fieldMin]: { $lte: max },
        [fieldMax]: { $gte: min }
    };
}
