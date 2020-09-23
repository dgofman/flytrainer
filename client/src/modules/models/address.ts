import { BaseModel } from './base.model';

export class Address extends BaseModel {
    type: string;
    other: string;
    description: string;
    pobox: string;
    street: string;
    city: string;
    code: string;
    state: string;
    country: string;
    phone: string;
    fax: string;
    isPrimary: number;
    document: number;
    user: number;
}
