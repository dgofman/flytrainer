import { BaseModel } from './base.model';
import { Account } from './account';

export class User extends BaseModel {
    id: string;
    username: string;
    uuid: string;
    first: string;
    middle: string;
    last: string;
    email: string;
    isActive: number;
    resetPassword: number;
    role: string;
    version: number;
    phone: string;
    password: string;
    createdDate: number;
    modifiedDate: number;
    whoCreated: number;
    whoModified: number;

    currentAccount: Account;

    constructor(json?: any) {
        super(json);
        if (!this.currentAccount) {
            this.currentAccount = new Account({balance: 0});
        }
    }
}
