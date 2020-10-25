import Locales from '@locales/admin';
import { Component, ViewChild } from '@angular/core';
import { AdminService } from 'src/services/admin.service';
import { User } from 'src/modules/models/base.model';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';
import { EmitEvent, EventType } from '../component/ft-table/ft-table.component';
import { Role, ColumnType } from 'src/modules/models/constants';
import { FTIcons } from '../component/ft-menu/ft-menu.component';
import { Validators } from '@angular/forms';
import { FTDialogComponent } from '../component/ft-dialog/ft-dialog.component';
import { TableResult } from 'src/modules/models/table.result';
import { AppHeaderComponent } from '../app.component';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent extends AppBaseDirective {
  Locales = Locales;
  icons = FTIcons;
  result: TableResult<User>;

  cols: ColumnType[] = [
    { field: 'id', show: 'never'},
    { field: 'version', show: 'never'},
    { field: 'username', type: 'input', show: true, header: Locales.username, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'first', type: 'input', show: true, header: Locales.firstname, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'middle', type: 'input', header: Locales.middlename, width: 150 },
    { field: 'last', type: 'input', show: true, header: Locales.lastname, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'email', type: 'input', show: true, header: Locales.email, width: 200, validators: [Validators.required, Validators.email, Validators.maxLength(100)] },
    { field: 'phone', type: 'input', show: true, header: Locales.cellphone, width: 150, validators: [Validators.maxLength(30)] },
    { field: 'ftn', type: 'input', header: Locales.ftn, width: 100, validators: [Validators.maxLength(10)] },
    { field: 'role', type: 'popup', value: Object.keys(Role).map(key => ({ label: Role[key], value: key })), show: true, header: Locales.role, width: 100, align: 'center', validators: [Validators.required] },
    { field: 'isMemeber', type: 'radio', header: Locales.isMemeber, width: 70, align: 'center', format: 'bool' },
    { field: 'isActive', type: 'radio', show: true, header: Locales.isActive, width: 70, align: 'center', format: 'bool' },
    { field: 'resetPassword', type: 'radio', header: Locales.resetPassword, width: 70, align: 'center', format: 'bool' },
    { field: 'isCitizen', type: 'radio', header: Locales.isCitizen, width: 70, align: 'center', format: 'bool' },
    { field: 'isSchoolEmployee', type: 'radio', header: Locales.isSchoolEmployee, width: 70, align: 'center', format: 'bool' },
    { field: 'englishProficient', type: 'radio', header: Locales.englishProficient, width: 70, align: 'center', format: 'bool' },
    { field: 'birthday', type: 'cal', header: Locales.birthday, width: 200, format: 'date' },
    { field: 'dl', type: 'input', header: Locales.driverLicense, width: 100, validators: [Validators.maxLength(10)] },
    { field: 'dlState', type: 'input', header: Locales.driverState, width: 50, validators: [Validators.maxLength(10)] },
    { field: 'dlExpDate', type: 'cal', header: Locales.dlExpDate, width: 100, format: 'date' },
    { field: 'createdDate', type: 'cal', header: Locales.createdDate, width: 200, format: 'datetime' },
    { field: 'modifiedDate', type: 'cal', show: true, header: Locales.modifiedDate, width: 200, format: 'datetime' },
    { field: 'whoCreated', type: 'input', header: Locales.whoCreated, width: 200 },
    { field: 'whoModified', type: 'input', header: Locales.whoModified, width: 200 }
  ];

  @ViewChild(FTDialogComponent) dialog: FTDialogComponent;

  selectedUser: User;

  constructor(private adminService: AdminService, public appService: AuthService) {
    super();
  }

  onEdit(user: User) {
    this.selectedUser = user;
    this.dialog.selectedItem = user;
    this.dialog.show = true;
    AppHeaderComponent.toggleArrowMenu = false;
  }

  eventTableHandler(event: EmitEvent) {
    switch (event.message) {
      case EventType.Load:
        this.loading(true);
        this.adminService.getUsers(event.data).subscribe(result => {
          this.loading(false);
          this.result = result;
        }, (ex) => this.errorHandler(ex));
        break;
    }
  }
}
