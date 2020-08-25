import Locales from '@locales/admin';
import { Component } from '@angular/core';

import { ConfirmationService, SelectItem } from 'primeng/api';
import { AdminFormDirective } from '../component/ft-table-form.component';
import { FTTableFormProviderDirective } from '../component/ft-table.component';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';
import { Session, RoleType } from 'src/modules/models/constants';

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
