export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function timeout(ms: number) {
    return new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), ms));
}
