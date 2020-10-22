import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TableResult } from 'src/modules/models/table.result';
import { CommonModel, Address, Document } from 'src/modules/models/base.model';

@Injectable()
export class AdminService {

    public constructor(private http: HttpClient) {
    }

    // Address
    public addAddress(userId: number, model: Address): Observable<Address> {
        return this.http.post<Address>(`/address/${userId}`, model);
    }

    public getAddress(userId: number): Observable<Address[]> {
        return this.http.get<Address[]>(`/address/${userId}`);
    }

    public updateAddress(userId: number, model: Address): Observable<Address> {
        return this.http.patch<Address>(`/address/${userId}`, model);
    }

    public deleteAddress(userId: number, addressId: number): Observable<void> {
        return this.http.delete<void>(`/address/${userId}/${addressId}`);
    }

    // Certificate
    public addCertificate(userId: number, model: CommonModel): Observable<CommonModel> {
        return this.http.post<CommonModel>(`/certificate/${userId}`, model);
    }

    public getCertificate(userId: number): Observable<CommonModel[]> {
        return this.http.get<CommonModel[]>(`/certificate/${userId}`);
    }

    public updateCertificate(userId: number, model: CommonModel): Observable<CommonModel> {
        return this.http.patch<CommonModel>(`/certificate/${userId}`, model);
    }

    public deleteCertificate(userId: number, addressId: number): Observable<void> {
        return this.http.delete<void>(`/certificate/${userId}/${addressId}`);
    }

    // Contacts
    public addContact(userId: number, model: CommonModel): Observable<CommonModel> {
        return this.http.post<CommonModel>(`/contact/${userId}`, model);
    }

    public getContacts(userId: number, offset: number): Observable<TableResult<CommonModel>> {
        return this.http.get<TableResult<Document>>(`/contact/${userId}?rows=25&offset=${offset}`);
    }

    public getContact(userId: number, contactId: number): Observable<CommonModel> {
        return this.http.get<CommonModel>(`/contact/${userId}/${contactId}`);
    }

    public updateContact(userId: number, model: CommonModel): Observable<CommonModel> {
        return this.http.patch<CommonModel>(`/contact/${userId}`, model);
    }

    public deleteContact(userId: number, addressId: number): Observable<void> {
        return this.http.delete<void>(`/contact/${userId}/${addressId}`);
    }

    // Document
    public getDocuments(userId: number, offset: number): Observable<TableResult<Document>> {
        return this.http.get<TableResult<Document>>(`/documents/${userId}?rows=25&offset=${offset}`);
    }

    public lazyDocuments(userId: number, docId: number): Observable<Document[]> {
        return this.http.get<Document[]>(`/documents/${userId}/${docId}`);
    }

    public getDocument(userId: number, docId: number): Observable<Document> {
        return this.http.get<Document>(`/document/${userId}/${docId}`);
    }

    public saveDocument(userId: number, model: Document): Observable<Document> {
        return this.http.post<Document>(`/document/${userId}`, model);
    }

     public deleteDocument(userId: number, docId: number): Observable<void> {
        return this.http.delete<void>(`/document/${userId}/${docId}`);
    }
}
