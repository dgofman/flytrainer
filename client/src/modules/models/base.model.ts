export class BaseModel {
    public id: number;
    protected version: number;

    constructor(json?: any) {
        if (json) {
            Object.assign(this, json);
        }
    }

     serialize() {
        Object.keys(this).forEach(name => {
            if (this[name] === false) {
                this[name] = 0;
            } else if (this[name] === true) {
                this[name] = 1;
            }
        });
        return this;
    }
}
