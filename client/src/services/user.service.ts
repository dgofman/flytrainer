import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/modules/models/user';
import { FTTableEvent } from 'src/app/component/ft-table/ft-table.component';

@Injectable()
export class UserService {

  public constructor(private http: HttpClient) {
  }

  getUsers(model: FTTableEvent): Observable<User[]> {
    return this.http.post<User[]>('/users', model);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`/users/${id}`);
  }

  save(user: User): Observable<User> {
    return this.http.post<User>(`/users`, user);
  }

  delete(user: User): Observable<void> {
    return this.http.delete<void>(`/users/${user.id}`);
  }
}
