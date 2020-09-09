import { BaseModel } from './base.model';

export class Address extends BaseModel {
    type: number;
    other: string;
    description: string;
    number: number; /*p.o box*/
    district: string;
    street: string;
    city: string;
    state: string;
    country: string;
    code: number;
    phone: number;
    fax: number;
    isPrimary: boolean;
    node: number;


}

