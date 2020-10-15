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
    parentId: number;
    total: number;
}
