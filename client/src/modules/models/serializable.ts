export function serialize<T>(classReference: new() => T, json: any): T {
    const target = new classReference() as any;
    const obj = target.__proto__.jsonProperties || {};

    for (const className of Object.keys(obj)) {
        const dbName = obj[className];
        target[className] = json[dbName];
        delete json[dbName];
    }
    Object.assign(target, json);
    return target;
}

export function JsonProperty(dbName: string) {
    return (target: any, className: string) => {
        const obj = target.__proto__.jsonProperties || {};
        obj[className] = dbName;
        target.__proto__.jsonProperties = obj;
    };
}
