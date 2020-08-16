import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/modules/models/user';

@Injectable()
export class UserService {

  public constructor(private http: HttpClient) {
  }

  getUsers(startIndex: number, rows: number, sortBy?: string, sortDirection?: string, filter?: string, query?: string): Observable<User[]> {
    const url = `/users?startIndex=${startIndex}&rows=${rows}&sortBy=${sortBy || ''}&sortDirection=${sortDirection || ''}&filter=${filter || ''}&query=${query || ''}`;
    return this.http.get<User[]>(url);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`/users/${id}`);
  }

  save(user: User): Observable<User> {
    return this.http.post<User>(`/users`, user);
  }
}
