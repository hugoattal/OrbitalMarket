import { differenceInDays } from "date-fns";

export function computeScore(meanRating: number, countRating: number, releaseDate: Date, isFree: boolean, isBoosted: boolean, verificationRatio?: number) {
    if (countRating === 0) {
        return 0;
    }

    verificationRatio ??= 1;
    verificationRatio = verificationRatio * 0.9 + 0.1;

    const elapsedDays = differenceInDays(Date.now(), releaseDate);
    const starsDivider = isFree ? 10 : 1;
    let value = Math.pow(meanRating / 5, 2) * Math.sqrt(((countRating * verificationRatio) / starsDivider) / (elapsedDays + 30)) * 1000 + 1 / (elapsedDays + 30) + 1 || 0;

    if (isBoosted) {
        value *= 1.5;
    }

    return value;
}

export function getIsBoosted(description: string) {
    if (!description) {
        return false;
    }

    const orbitalString = "<a target=\"_blank\" href=\"https://orbital-market.com/";
    return description.indexOf(orbitalString) >= 0;
}
