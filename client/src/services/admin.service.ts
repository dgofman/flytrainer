import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TableResult } from 'src/modules/models/table.result';
import { CommonModel, Address, Contact, Document, User, Note } from 'src/modules/models/base.model';
import { FTTableEvent } from 'src/app/component/ft-table/ft-table.component';

@Injectable()
export class AdminService {

    public constructor(private http: HttpClient) {
    }

    // Notes
    public getNotes(id: number): Observable<Note> {
        return this.http.get<Note>(`/notes/${id}`);
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

    // Accounts
    public addAccount(userId: number, model: CommonModel): Observable<CommonModel> {
        return this.http.post<CommonModel>(`/account/${userId}`, model);
    }

    public getAccounts(userId: number): Observable<CommonModel[]> {
        return this.http.get<CommonModel[]>(`/account/${userId}`);
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

    public getAddressById(id: number): Observable<Address> {
        return this.http.get<Address>(`/address/id/${id}`);
    }

    public updateAddress(userId: number, model: Address): Observable<Address> {
        return this.http.patch<Address>(`/address/${userId}`, model);
    }

    public deleteAddress(userId: number, addressId: number): Observable<void> {
        return this.http.delete<void>(`/address/${userId}/${addressId}`);
    }

    public getLocations(model: FTTableEvent): Observable<TableResult<CommonModel>> {
        return this.http.put<TableResult<CommonModel>>(`/location`, model);
    }

    public deleteLocation(locationId: number): Observable<void> {
        return this.http.delete<void>(`/location/${locationId}`);
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

    public findCFICertificates(): Observable<any[]> {
        return this.http.get<any[]>(`/certificate/cfi`);
    }

    // Contacts
    public addContact(userId: number, model: Contact): Observable<Contact> {
        return this.http.post<Contact>(`/contact/${userId}`, model);
    }

    public getContacts(userId: number, offset: number): Observable<TableResult<Contact>> {
        return this.http.get<TableResult<Contact>>(`/contact/${userId}?rows=25&offset=${offset}`);
    }

    public updateContact(userId: number, model: CommonModel): Observable<Contact> {
        return this.http.patch<Contact>(`/contact/${userId}`, model);
    }

    public deleteContact(userId: number, contactId: number): Observable<void> {
        return this.http.delete<void>(`/contact/${userId}/${contactId}`);
    }

    // Endorsements
    public addEndorsement(userId: number, model: CommonModel): Observable<CommonModel> {
        return this.http.post<CommonModel>(`/endorsement/${userId}`, model);
    }

    public getEndorsements(userId: number, offset: number): Observable<TableResult<CommonModel>> {
        return this.http.get<TableResult<CommonModel>>(`/endorsement/${userId}?rows=25&offset=${offset}`);
    }

    public updateEndorsement(userId: number, model: CommonModel): Observable<CommonModel> {
        return this.http.patch<CommonModel>(`/endorsement/${userId}`, model);
    }

    public deleteEndorsement(userId: number, endorsementId: number): Observable<void> {
        return this.http.delete<void>(`/endorsement/${userId}/${endorsementId}`);
    }

    // Activities
    public addActivity(userId: number, model: CommonModel): Observable<CommonModel> {
        return this.http.post<CommonModel>(`/activity/${userId}`, model);
    }

    public getActivities(userId: number, offset: number): Observable<TableResult<CommonModel>> {
        return this.http.get<TableResult<CommonModel>>(`/activity/${userId}?rows=25&offset=${offset}`);
    }

    public updateActivity(userId: number, model: CommonModel): Observable<CommonModel> {
        return this.http.patch<CommonModel>(`/activity/${userId}`, model);
    }

    public deleteActivity(userId: number, activityId: number): Observable<void> {
        return this.http.delete<void>(`/activity/${userId}/${activityId}`);
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

        // Tier-Rates
    public addTier(model: CommonModel): Observable<CommonModel> {
        return this.http.post<CommonModel>(`/tier`, model);
    }

    public getTiers(model: FTTableEvent): Observable<TableResult<CommonModel>> {
        return this.http.put<TableResult<CommonModel>>(`/tier`, model);
    }

    public updateTier(model: CommonModel): Observable<CommonModel> {
        return this.http.patch<CommonModel>(`/tier`, model);
    }

    public deleteTier(tierId: number): Observable<void> {
        return this.http.delete<void>(`/tier/${tierId}`);
    }

    // Courses
    public createCourse(model: CommonModel): Observable<CommonModel> {
        return this.http.post<CommonModel>(`/course`, model);
    }

    public getCourse(id: number): Observable<CommonModel> {
        return this.http.get<CommonModel>(`/course/id/${id}`);
    }

    public getCourses(model: FTTableEvent): Observable<TableResult<CommonModel>> {
        return this.http.put<TableResult<CommonModel>>(`/course`, model);
    }

    public updateCourse(model: CommonModel): Observable<CommonModel> {
        return this.http.patch<CommonModel>(`/course`, model);
    }

    public deleteCourse(courseId: number): Observable<void> {
        return this.http.delete<void>(`/course/${courseId}`);
    }

    // Courses - UserCourse
    public createUserCourse(model: CommonModel, userId: number, courseId: number): Observable<CommonModel> {
        return this.http.post<CommonModel>(`/course/${userId}/${courseId}`, model);
    }

    public getUserCourses(userId: number, offset: number): Observable<TableResult<CommonModel>> {
        return this.http.get<TableResult<CommonModel>>(`/course/${userId}?rows=25&offset=${offset}`);
    }

    public updateUserCourse(model: CommonModel, userId: number, courseId: number): Observable<CommonModel> {
        return this.http.patch<CommonModel>(`/course/${userId}/${courseId}`, model);
    }

    public deleteUserCourse(userId: number, courseId: number): Observable<void> {
        return this.http.delete<void>(`/course//${userId}/${courseId}`);
    }
}
