import Locales from '@locales/admin';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { AdminFormDirective } from '../component/ft-table-form.component';
import { FTTableFormProviderDirective } from '../component/ft-table.component';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';
import { Role } from 'src/modules/models/constants';

@Component({
  templateUrl: './userform.component.html',
  styleUrls: ['../component/ft-table.component.less']
})
export class UserFormComponent extends AdminFormDirective {
  Locales = Locales;
  yearRange = ((new Date().getFullYear() - 80) + ':' + (new Date().getFullYear()));
  Roles = Object.keys(Role).map(key => {
    return {label: Role[key], value: key};
  });

  constructor(formProvider: FTTableFormProviderDirective, confirmationService: ConfirmationService, private userService: UserService) {
    super(formProvider, confirmationService);
    this.frmGroup = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      username: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      first: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      middle: new FormControl(),
      last: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(100)]),
      phone: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      ftn: new FormControl(null, [Validators.maxLength(10)]),
      role: new FormControl(null, [Validators.required]),
      isActive: new FormControl(),
      resetPassword: new FormControl(),
      isSchoolEmployee: new FormControl(),
      birthday: new FormControl(),
      dl: new FormControl(null, [Validators.maxLength(10)]),
      dlState: new FormControl(null, [Validators.maxLength(2)]),
      dlExpDate: new FormControl(null, [Validators.required]),
      createdDate: new FormControl(),
      modifiedDate: new FormControl(),
      whoCreated: new FormControl(),
      whoModified: new FormControl(),
    });
  }

  setData(data: any) {
    super.setData(data);
    if (data.id !== -1) {
      this.loading(true);
      this.userService.getUserById((data as User).id).subscribe(user => {
        this.loading(false);
        super.setData(user);
      }, (ex) => this.errorHandler(ex, {nouser: Locales.invalidRequest}));
    }
  }

  applyItem(event: Event) {
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

  }

}
