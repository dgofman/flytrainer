import { AbstractBase } from './base.model';

export class Document extends AbstractBase {
    reference: string;
    type: string;
    other: string;
    description: string;
    pageNumber: number;
    isFrontSide: number;
    isSuspended: number;
    isWithdrawn: number;
    url: string;
    password: string;
    file: any;
    fileName: string;
    filePath: string;
    contentType: string;
    size: number;
    issuedDate: Date;
    expDate: Date;
    parent: number; // FK -  parent_id document
    user: any; // FK -  user_id document
    aircraft: any; // FK - aircraft_id document
}
