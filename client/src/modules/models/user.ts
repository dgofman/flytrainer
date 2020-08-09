import { BaseModel } from './base.model';
import { Account } from './account';

export class User extends BaseModel {
    username: string;
    protected uuid: string;
    first: string;
    middle: string;
    last: string;
    email: string;
    phone: string;
    ftn: string;
    role: string;
    isActive: number;
    isResetPassword: number;
    isSchoolEmployee: number;
    birthday: Date;
    dl: string; /* driving license */
    dlState: string; /* driving license state */
    dlExpDate: Date;  /* driving license expiration date */
    protected ssn: string;
    protected password: string;
    createdDate: number;
    modifiedDate: number;
    whoCreated: number;
    whoModified: number;

    currentAccount: Account;
}
