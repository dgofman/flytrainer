import { BaseModel } from './base.model';

export class Certificate extends BaseModel {
    type: string;
    other: string;
    description: string;
    aircraftClass: any;
    number: string;
    limitations: string;
    issuedDate: Date;
    renewDate: Date;
    expDate: Date;
    currentBy: Date;
    isSuspended: number;
    isWithdrawn: number;
    user: number;
}
