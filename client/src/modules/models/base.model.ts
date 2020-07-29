export class BaseModel {
    constructor(json?: any) {
        if (json) {
            Object.assign(this, json);
        }
    }
}
