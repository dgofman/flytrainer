import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/modules/models/user';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {

  public constructor(private http: HttpClient) {
  }

  getUser(): Observable<User> {
    return this.http.get<User>('../modules/data/user.json').pipe(map(json => User.serialize(json)));
  }
}
