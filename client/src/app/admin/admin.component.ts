import Locales from '@locales/admin';
import { Component, ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';
import { ColumnType, EventType } from '../component/ft-table.component';
import { UserFormComponent } from './userform.component';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.less']
})
export class AdminComponent extends AppBaseDirective {
  Locales = Locales;
  tableExpandForm = UserFormComponent;
  users: User[];

  cols: ColumnType[] = [
    { field: 'username', header: Locales.username, width: 150 },
    { field: 'first', header: Locales.firstname, width: 150 },
    { field: 'last', header: Locales.lastname, width: 150 },
    { field: 'email', header: Locales.email, width: 200 },
    { field: 'phone', header: Locales.cellphone, width: 150 },
    { field: 'role', header: Locales.role, width: 100 },
    { field: 'isActive', header: Locales.isActive, width: 70 },
    { field: 'modifiedDate', header: Locales.modifiedDate, width: 200, format: 'date' }
  ];

  constructor(changeDetector: ChangeDetectorRef, private userService: UserService, public appService: AuthService) {
    super(changeDetector);
  }

  eventTableHandler(event: any) {
    switch (event.message) {
      case EventType.Load:
        this.loading(true);
        this.userService.getUser(0, 20, 'username').subscribe(users => {
          this.loading(false);
          this.users = users;
        }, (ex) => this.errorHandler(ex));
        break;
    }
  }
}
