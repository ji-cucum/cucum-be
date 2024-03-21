export const bigIntToString = (key, value) => {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    return value;
}