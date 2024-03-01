export function getCurrentFormattedTime(): string {
    return new Date().toLocaleString()
}

export function convertUnixTimeToFormattedTime(unixTime: number): string {
    return new Date(unixTime * 1000).toLocaleString()
}