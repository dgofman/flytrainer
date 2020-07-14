export function JsonProperty(dbName: string) {
    return (target: any, className: string) => {
        const obj = target.__proto__.jsonProperties || {};
        obj[className] = dbName;
        target.__proto__.jsonProperties = obj;
    };
}

export function serialize<T>(target: T): any {
    const obj = getJsonProperties(target);
    const json = Object.assign({}, target);
    for (const className of Object.keys(obj)) {
        const dbName = obj[className];
        json[dbName] = target[className];
        delete json[className];
    }
    return json;
}

export function deserialize<T>(classReference: new() => T, json: any): T {
    const target = new classReference();
    const obj = getJsonProperties(target);
    for (const className of Object.keys(obj)) {
        const dbName = obj[className];
        target[className] = json[dbName];
        delete json[dbName];
    }
    Object.assign(target, json);
    return target;
}

function getJsonProperties(target: any) {
    return target.__proto__.jsonProperties || {};
}
