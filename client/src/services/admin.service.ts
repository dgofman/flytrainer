import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from 'src/modules/models/address';
import { TableResult } from 'src/modules/models/table.result';

@Injectable()
export class AdminService {

  public constructor(private http: HttpClient) {
  }

  public address(model: Address): Observable<Address> {
    return this.http.post<Address>('/admin/address', model);
  }

}
