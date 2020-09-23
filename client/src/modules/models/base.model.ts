export class  AbstractBase {
    protected version: number;
    id: number;
    createdDate: number;
    modifiedDate: number;

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

export class Note extends AbstractBase {
    content: string;
}

export class BaseModel extends AbstractBase {
    whoCreated: number;
    whoModified: number;
    notes: Note;

    constructor(json?: any) {
        super(json);
    }
}
