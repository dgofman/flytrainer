import Locales from '@locales/admin';
import { Component } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';
import { ColumnType, FTTableComponent, EmitEvent, EventType } from '../component/ft-table.component';
import { UserFormComponent } from './userform.component';
import { Role } from 'src/modules/models/constants';
import { Validators } from '@angular/forms';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent extends AppBaseDirective {
  Locales = Locales;
  tableExpandForm = UserFormComponent;
  users: User[];

  cols: ColumnType[] = [
    { field: 'id', show: 'never'},
    { field: 'version', show: 'never'},
    { field: 'username', show: 'table', header: Locales.username, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'first', show: 'table', header: Locales.firstname, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'middle', show: 'filter', header: Locales.middlename, width: 150 },
    { field: 'last', show: 'table', header: Locales.lastname, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'email', show: 'table', header: Locales.email, width: 200, validators: [Validators.required, Validators.email, Validators.maxLength(100)] },
    { field: 'phone', show: 'table', header: Locales.cellphone, width: 150, validators: [Validators.maxLength(30)] },
    { field: 'ftn', show: 'filter', header: Locales.ftn, width: 100, validators: [Validators.maxLength(10)] },
    { field: 'role', show: 'table', header: Locales.role, width: 100, align: 'center', validators: [Validators.required] },
    { field: 'isMemeber', show: 'filter', header: Locales.isMemeber, width: 70, align: 'center', format: 'bool' },
    { field: 'isActive', show: 'table', header: Locales.isActive, width: 70, align: 'center', format: 'bool' },
    { field: 'resetPassword', show: 'filter', header: Locales.resetPassword, width: 70, align: 'center', format: 'bool' },
    { field: 'isCitizen', show: 'filter', header: Locales.isCitizen, width: 70, align: 'center', format: 'bool' },
    { field: 'isSchoolEmployee', show: 'filter', header: Locales.isSchoolEmployee, width: 70, align: 'center', format: 'bool' },
    { field: 'englishProficient', show: 'filter', header: Locales.englishProficient, width: 70, align: 'center', format: 'bool' },
    { field: 'birthday', show: 'filter', header: Locales.birthday, width: 200, format: 'epoch' },
    { field: 'dl', show: 'filter', header: Locales.driverLicense, width: 100, validators: [Validators.maxLength(10)] },
    { field: 'dlState', show: 'filter', header: Locales.driverState, width: 50, validators: [Validators.maxLength(10)] },
    { field: 'dlExpDate', show: 'filter', header: Locales.dlExpDate, width: 100, format: 'epoch' },
    { field: 'createdDate', show: 'filter', header: Locales.createdDate, width: 200, format: 'datetime' },
    { field: 'modifiedDate', show: 'table', header: Locales.modifiedDate, width: 200, format: 'datetime' },
    { field: 'whoCreated', show: 'filter', header: Locales.whoCreated, width: 200 },
    { field: 'whoModified', show: 'filter', header: Locales.whoModified, width: 200 }
  ];

  constructor(private userService: UserService, public appService: AuthService) {
    super();
  }

  onMoreDetails(user: User) {
    console.log(user);
  }

  eventTableHandler(event: EmitEvent) {
    switch (event.message) {
      case EventType.New:
        const user = event.data as User;
        user.dlState = 'CA';
        user.role = Role.USER;
        user.isActive = 1;
        user.resetPassword = 1;
        user.englishProficient = 1;
        break;
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
