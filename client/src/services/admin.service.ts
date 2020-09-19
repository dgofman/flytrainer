import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from 'src/modules/models/address';

@Injectable()
export class AdminService {

    public constructor(private http: HttpClient) {
    }

    public addAddress(userId: number, model: Address): Observable<Address> {
        return this.http.post<Address>(`/admin/${userId}/address`, model);
    }


    public getAddress(userId: number): Observable<Address[]> {
        return this.http.get<Address[]>(`/admin/${userId}/address`);
    }

    public updateAddress(userId: number, model: Address): Observable<Address> {
        return this.http.patch<Address>(`/admin/${userId}/address`, model);
    }

    public deleteAddress(userId: number, addressId: number): Observable<void> {
        return this.http.delete<void>(`/admin/${userId}/address/${addressId}`);
    }
}
