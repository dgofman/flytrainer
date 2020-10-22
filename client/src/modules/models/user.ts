import { BaseModel } from './base.model';

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
    resetPassword: number;
    isSchoolEmployee: number;
    isCitizen: number;
    englishProficient: number;
    isMemeber: number;
    birthday: number;
    dl: string; /* driving license */
    dlState: string; /* driving license state */
    dlExpDate: number;  /* driving license expiration date */
    protected ssn: string;
    protected password: string;

    currentAccount: BaseModel;
}
