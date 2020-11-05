import Locales from '@locales/admin';
import { Component, ViewChild, Directive, Input, NgModule } from '@angular/core';
import { AdminService } from 'src/services/admin.service';
import { User } from 'src/modules/models/base.model';
import { AppBaseDirective } from '../app.base.component';
import { Role, ColumnType } from 'src/modules/models/constants';
import { FTDialogComponent } from '../component/ft-dialog/ft-dialog.component';
import { TableResult } from 'src/modules/models/table.result';
import { AppHeaderComponent } from '../app.component';
import { EventService, EmitEvent, EventType } from 'src/services/event.service';
import { FTTableComponent } from '../component/ft-table/ft-table.component';
import { AbstractTabDirective, AbstractTabModule } from './abstract-tab.component';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from './admin-shared.module';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./admin.component.less']
})
export class UserComponent extends AppBaseDirective {
  Locales = Locales;
  result: TableResult<User>;
  selectedUser: User;

  @ViewChild(FTTableComponent) table: FTTableComponent;
  @ViewChild(FTDialogComponent) dialog: FTDialogComponent;

  accCols: ColumnType[] = [
        { field: 'type', header: Locales.type, width: 150, },
        { field: 'accountId', header: Locales.accountNumber, width: 150, },
        { field: 'expDate', header: Locales.expDate, width: 200, format: 'date' },
        { field: 'autoPayment', header: Locales.autoPayment, width: 100 },
        { field: 'defaultTier', header: Locales.tierRates, width: 100 },
        { field: 'isActive', header: Locales.isActive, type: 'radio', format: 'bool', width: 70, align: 'center' },
        { field: 'description', header: Locales.description, width: 200 },
        { field: 'notes', header: Locales.notes, path: ['content'] },
    ];

  cols: ColumnType[] = [
    { field: 'id', header: Locales.id, type: 'input', width: 50 },
    { field: 'version', show: 'never'},
    { field: 'username', type: 'input', show: true, header: Locales.username, width: 150 },
    { field: 'first', type: 'input', show: true, header: Locales.firstname, width: 150 },
    { field: 'middle', type: 'input', header: Locales.middlename, width: 150 },
    { field: 'last', type: 'input', show: true, header: Locales.lastname, width: 150 },
    { field: 'email', type: 'input', show: true, header: Locales.email, width: 200 },
    { field: 'phone', type: 'input', show: true, header: Locales.cellphone, width: 150 },
    { field: 'ftn', type: 'input', header: Locales.ftn, width: 100 },
    { field: 'role', type: 'popup', value: Object.keys(Role).map(key => ({ label: Role[key], value: key })), show: true, header: Locales.role, width: 100, align: 'center' },
    { field: 'isMemeber', type: 'radio', header: Locales.isMemeber, width: 70, align: 'center', format: 'bool' },
    { field: 'isActive', type: 'radio', show: true, header: Locales.isActive, width: 70, align: 'center', format: 'bool' },
    { field: 'resetPassword', type: 'radio', header: Locales.resetPassword, width: 70, align: 'center', format: 'bool' },
    { field: 'isCitizen', type: 'radio', header: Locales.isCitizen, width: 70, align: 'center', format: 'bool' },
    { field: 'isSchoolEmployee', type: 'radio', header: Locales.isSchoolEmployee, width: 70, align: 'center', format: 'bool' },
    { field: 'englishProficient', type: 'radio', header: Locales.englishProficient, width: 70, align: 'center', format: 'bool' },
    { field: 'birthday', type: 'cal', header: Locales.birthday, width: 200, format: 'date' },
    { field: 'dl', type: 'input', header: Locales.driverLicense, width: 100 },
    { field: 'dlState', type: 'input', header: Locales.driverState, width: 50 },
    { field: 'dlExpDate', type: 'cal', header: Locales.dlExpDate, width: 100, format: 'date' },
    { field: 'createdDate', type: 'cal', header: Locales.createdDate, width: 200, format: 'datetime' },
    { field: 'modifiedDate', type: 'cal', show: true, header: Locales.modifiedDate, width: 200, format: 'datetime' },
    { field: 'whoCreated', type: 'input', header: Locales.whoCreated, width: 200 },
    { field: 'whoModified', type: 'input', header: Locales.whoModified, width: 200 }
  ];

  constructor(private adminService: AdminService, eventService: EventService) {
    super();
    eventService.emmiter.subscribe((event: EmitEvent) => {
      switch (event.message) {
        case EventType.Refresh:
          if (event.data) {
            this.updateDialog(event.data);
          }
          this.table.expandedRows = {};
          this.table.refresh();
          break;
      }
    });
  }

  updateDialog(user: User) {
    let path = [Locales.admin, Locales.users];
    if (user.id) {
      path = path.concat(user.first + ' ' + user.last);
    }
    this.dialog.path = path;
    for (let i = 1; i < this.dialog.tabView.tabs.length; i++) {
      this.dialog.tabView.tabs[i].disabled = !user.id;
    }
    this.selectedUser = user;
    this.dialog.selectedItem = user;
    this.dialog.show = true;
  }

  onAddUser() {
    this.updateDialog(new User());
    AppHeaderComponent.toggleArrowMenu = false;
  }

  onEdit(user: User) {
    this.updateDialog(user);
    AppHeaderComponent.toggleArrowMenu = false;
  }

  onAddAccount(user: User) {
    this.onEdit(user);
    this.dialog.onTabChange(1);
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
      case EventType.Expand:
        this.adminService.getAccounts(event.data.id).subscribe(e => {
            this.loading(false);
            event.data.accounts = e;
        }, (ex) => this.errorHandler(ex));
        break;
    }
  }
}

@Directive()
export abstract class UserTabBaseDirective extends AbstractTabDirective {
    @Input() user: User;

    constructor(confirmationService: ConfirmationService) {
        super(confirmationService);
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, AbstractTabModule],
    exports: [AbstractTabModule]
})
export class UserTabBaseModule {
}
