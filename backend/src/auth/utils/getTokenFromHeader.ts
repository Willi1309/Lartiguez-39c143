export function getTokenFromHeader(headers: { authorization?: string }): string | null {
    if (headers && headers.authorization) {
        const parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        }
    }
    return null;
}