import Locales from '@locales/admin';
import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { ConfirmationService, SelectItem } from 'primeng/api';
import { AdminFormDirective } from '../component/ft-table-form.component';
import { FTTableFormProviderDirective } from '../component/ft-table.component';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';
import { Session, RoleType } from 'src/modules/models/constants';
import { FTFormControl } from '../utils/ft-form.control';

@Component({
  templateUrl: './userform.component.html',
  styleUrls: ['../component/ft-table.component.less']
})
export class UserFormComponent extends AdminFormDirective {
  Locales = Locales;
  yearRange = ((new Date().getFullYear() - 80) + ':' + (new Date().getFullYear()));
  Roles: SelectItem[] = [];
  session: Session;

  constructor(formProvider: FTTableFormProviderDirective, private confirmationService: ConfirmationService, private userService: UserService) {
    super(formProvider);
    this.session = this.AppUtils.getSession();

    const userLevel = RoleType.indexOf(this.session.role);
    RoleType.forEach((role, index) => {
      if (index <= userLevel) {
        this.Roles.push({label: role, value: role});
      }
    });

    this.frmGroup = new FormGroup({
      id: new FTFormControl(this.dataKey),
      version: new FTFormControl('version'),
      username: new FTFormControl(Locales.username, [Validators.required, Validators.maxLength(50)]),
      first: new FTFormControl(Locales.firstname, [Validators.required, Validators.maxLength(50)]),
      middle: new FTFormControl(Locales.middlename),
      last: new FTFormControl(Locales.lastname, [Validators.required, Validators.maxLength(50)]),
      email: new FTFormControl(Locales.email, [Validators.required, Validators.email, Validators.maxLength(100)]),
      phone: new FTFormControl(Locales.cellphone, [Validators.maxLength(30)]),
      ftn: new FTFormControl(Locales.ftn, [Validators.maxLength(10)]),
      role: new FTFormControl(Locales.role, [Validators.required]),
      isMemeber: new FTFormControl(Locales.isMemeber),
      isActive: new FTFormControl(Locales.isActive),
      resetPassword: new FTFormControl(Locales.resetPassword),
      isCitizen: new FTFormControl(Locales.isCitizen),
      isSchoolEmployee: new FTFormControl(Locales.isSchoolEmployee),
      englishProficient: new FTFormControl(Locales.englishProficient),
      birthday: new FTFormControl(Locales.birthday),
      dl: new FTFormControl(Locales.driverLicense, [Validators.maxLength(10)]),
      dlState: new FTFormControl(Locales.driverState, [Validators.maxLength(2)]),
      dlExpDate: new FTFormControl(Locales.dlExpDate),
      createdDate: new FTFormControl(Locales.createdDate),
      modifiedDate: new FTFormControl(Locales.modifiedDate),
      whoCreated: new FTFormControl(Locales.whoCreated),
      whoModified: new FTFormControl(Locales.whoModified),
    });
  }

  setData(data: any) {
    super.setData(data);
    if (!this.isNew(data)) {
      this.loading(true);
      this.userService.getUserById((data as User).id).subscribe(user => {
        this.loading(false);
        super.setData(user);
      }, (ex) => this.errorHandler(ex, {nouser: Locales.invalidRequest}));
    }
  }

  applyItem(event: Event): boolean {
    if (super.applyItem(event)) {
      this.loading(true);
      this.userService.save(this.getData() as User).subscribe(user => {
          this.loading(false);
          super.setData(user);
          this.doCancel();
        }, (ex) => this.errorHandler(ex));
      }
    return true;
  }

  doDelete(): void {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      accept: () => {
        this.loading(true);
        this.userService.delete(this.getData() as User).subscribe(_ => {
          this.loading(false);
          this.deleteItem();
      }, (ex) => this.errorHandler(ex));
    }
    });
  }
}
