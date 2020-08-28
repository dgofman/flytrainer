import Locales from '@locales/admin';
import { Component } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';
import { ColumnType, FTTableComponent, EmitEvent, EventType } from '../component/ft-table.component';
import { UserFormComponent } from './userform.component';
import { Role, RoleType } from 'src/modules/models/constants';
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
    { field: 'username', type: 'input', show: 'default', header: Locales.username, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'first', type: 'input', show: 'default', header: Locales.firstname, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'middle', type: 'input', header: Locales.middlename, width: 150 },
    { field: 'last', type: 'input', show: 'default', header: Locales.lastname, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'email', type: 'input', show: 'default', header: Locales.email, width: 200, validators: [Validators.required, Validators.email, Validators.maxLength(100)] },
    { field: 'phone', type: 'input', show: 'default', header: Locales.cellphone, width: 150, validators: [Validators.maxLength(30)] },
    { field: 'ftn', type: 'input', header: Locales.ftn, width: 100, validators: [Validators.maxLength(10)] },
    { field: 'role', type: 'popup', value: RoleType.map(role => ({label: role, value: role})), show: 'default', header: Locales.role, width: 100, align: 'center', validators: [Validators.required] },
    { field: 'isMemeber', type: 'check', header: Locales.isMemeber, width: 70, align: 'center', format: 'bool' },
    { field: 'isActive', type: 'check', show: 'default', header: Locales.isActive, width: 70, align: 'center', format: 'bool' },
    { field: 'resetPassword', type: 'check', header: Locales.resetPassword, width: 70, align: 'center', format: 'bool' },
    { field: 'isCitizen', type: 'check', header: Locales.isCitizen, width: 70, align: 'center', format: 'bool' },
    { field: 'isSchoolEmployee', type: 'check', header: Locales.isSchoolEmployee, width: 70, align: 'center', format: 'bool' },
    { field: 'englishProficient', type: 'check', header: Locales.englishProficient, width: 70, align: 'center', format: 'bool' },
    { field: 'birthday', type: 'cal', header: Locales.birthday, width: 200, format: 'epoch' },
    { field: 'dl', type: 'input', header: Locales.driverLicense, width: 100, validators: [Validators.maxLength(10)] },
    { field: 'dlState', type: 'input', header: Locales.driverState, width: 50, validators: [Validators.maxLength(10)] },
    { field: 'dlExpDate', type: 'cal', header: Locales.dlExpDate, width: 100, format: 'epoch' },
    { field: 'createdDate', type: 'cal', header: Locales.createdDate, width: 200, format: 'datetime' },
    { field: 'modifiedDate', type: 'cal', show: 'default', header: Locales.modifiedDate, width: 200, format: 'datetime' },
    { field: 'whoCreated', type: 'input', header: Locales.whoCreated, width: 200 },
    { field: 'whoModified', type: 'input', header: Locales.whoModified, width: 200 }
  ];

  constructor(private userService: UserService, public appService: AuthService) {
    super();
  }

  onEdit(user: User) {
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
        this.userService.getUsers(t.firstRow, t.itemsPerPage, t.sortField, t.sortDirection).subscribe(users => {
          this.loading(false);
          this.users = users;
        }, (ex) => this.errorHandler(ex));
        break;
    }
  }
}
