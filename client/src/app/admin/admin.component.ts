import Locales from '@locales/admin';
import { Component } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';
import { ColumnType, EventType, EmitEvent, FTTableComponent } from '../component/ft-table.component';
import { UserFormComponent } from './userform.component';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
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
    { field: 'role', header: Locales.role, width: 100, align: 'center' },
    { field: 'isActive', header: Locales.isActive, width: 70, align: 'center', format: 'bool' },
    { field: 'modifiedDate', header: Locales.modifiedDate, width: 200, format: 'date' }
  ];

  constructor(private userService: UserService, public appService: AuthService) {
    super();
  }

  eventTableHandler(event: EmitEvent) {
    switch (event.message) {
      case EventType.Load:
        const t = event.data as FTTableComponent;
        this.loading(true);
        this.userService.getUsers(t.firstRow, t.itemsPerPage, t.sortField, t.sortDirection, t.filterColumn, t.filterQuery).subscribe(users => {
          this.loading(false);
          this.users = users;
        }, (ex) => this.errorHandler(ex));
        break;
    }
  }
}
