export function convertTimestampToDate(timestamp: number): Date {
    return new Date(timestamp);
}

export function convertTimestampToIsostringDate(timestamp: number): string {
    return convertTimestampToDate(timestamp).toISOString();
}

export function convertIsoStringDateToDate(isoString: string): Date {
    return new Date(isoString);
}