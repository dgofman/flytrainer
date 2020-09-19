export class BaseModel {
    public id: number;
    protected version: number;

    constructor(json?: any) {
        if (json) {
            Object.keys(json).forEach(key => {
                if (typeof json[key] === 'boolean') {
                    this[key] = json[key] === true ? 1 : 0;
                } else {
                    this[key] = json[key];
                }
            });
        }
    }
}
