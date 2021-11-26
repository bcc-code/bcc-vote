export default (timeoutMs: number, promise: () => Promise<any>) => {
    return Promise.race([
        promise(),
        new Promise((resolve, reject) => setTimeout(() => reject('Promise timeout'), timeoutMs)),
    ]);
}