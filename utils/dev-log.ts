export function devLog(...args: unknown[]) {
    if (__DEV__) console.log(...args)
}