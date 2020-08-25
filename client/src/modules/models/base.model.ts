export class BaseModel {
    public id: number;
    protected version: number;

    constructor(json?: any) {
        if (json) {
            Object.assign(this, json);
        }
    }
}
