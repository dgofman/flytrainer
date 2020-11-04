import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TableResult } from 'src/modules/models/table.result';
import { CommonModel, Address, Contact, Document, User } from 'src/modules/models/base.model';
import { FTTableEvent } from 'src/app/component/ft-table/ft-table.component';

@Injectable()
export class AdminService {

    public constructor(private http: HttpClient) {
    }

    // Users
    public addUser(model: User): Observable<User> {
        return this.http.post<User>(`/user`, model);
    }

    public getUsers(model: FTTableEvent): Observable<TableResult<User>> {
        return this.http.put<TableResult<User>>('/user', model);
    }

    public getUser(userId: number): Observable<User> {
        return this.http.get<User>(`/user/${userId}`);
    }

    public updateUser(userId: number, model: User): Observable<User> {
        return this.http.patch<User>(`/user/${userId}`, model);
    }

    public getPassword(userId: number, username: string): Observable<string> {
        return this.http.get<string>(`/user/${userId}/${username}`);
    }

    // Tier-Rates
    public addTier(model: CommonModel): Observable<CommonModel> {
        return this.http.post<User>(`/tier`, model);
    }

    public getTiers(model: FTTableEvent): Observable<TableResult<CommonModel>> {
        return this.http.post<TableResult<User>>(`/tiers`, model);
    }

    public updateTier(model: CommonModel): Observable<CommonModel> {
        return this.http.patch<User>(`/tier`, model);
    }

    public deleteTier(tierId: number): Observable<void> {
        return this.http.delete<void>(`/tier/${tierId}`);
    }

    // Accounts
    public addAccount(userId: number, model: CommonModel): Observable<CommonModel> {
        return this.http.post<CommonModel>(`/account/${userId}`, model);
    }

    public getAccounts(userId: number): Observable<CommonModel[]> {
        return this.http.get<CommonModel[]>(`/account/${userId}`);
    }

    public getAccount(userId: number, accountId: number): Observable<CommonModel> {
        return this.http.get<CommonModel>(`/account/${userId}/${accountId}`);
    }

    public updateAccount(userId: number, model: CommonModel): Observable<CommonModel> {
        return this.http.patch<CommonModel>(`/account/${userId}`, model);
    }

    public deleteAccount(userId: number, accountId: number): Observable<void> {
        return this.http.delete<void>(`/account/${userId}/${accountId}`);
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

    public deleteCertificate(userId: number, certId: number): Observable<void> {
        return this.http.delete<void>(`/certificate/${userId}/${certId}`);
    }

    // Contacts
    public addContact(userId: number, model: Contact): Observable<Contact> {
        return this.http.post<Contact>(`/contact/${userId}`, model);
    }

    public getContacts(userId: number, offset: number): Observable<TableResult<Contact>> {
        return this.http.get<TableResult<Contact>>(`/contact/${userId}?rows=25&offset=${offset}`);
    }

    public getContact(userId: number, contactId: number): Observable<Contact> {
        return this.http.get<Contact>(`/contact/${userId}/${contactId}`);
    }

    public updateContact(userId: number, model: CommonModel): Observable<Contact> {
        return this.http.patch<Contact>(`/contact/${userId}`, model);
    }

    public deleteContact(userId: number, contactId: number): Observable<void> {
        return this.http.delete<void>(`/contact/${userId}/${contactId}`);
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
