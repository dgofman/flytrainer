import Locales from '@locales/admin';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { AdminFormDirective } from '../component/ft-table-form.component';
import { FTTableFormProviderDirective } from '../component/ft-table.component';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';

@Component({
  templateUrl: './userform.component.html',
  styleUrls: ['../component/ft-table.component.less']
})
export class UserFormComponent extends AdminFormDirective {
  Locales = Locales;


  constructor(formProvider: FTTableFormProviderDirective, confirmationService: ConfirmationService, private userService: UserService) {
    super(formProvider, confirmationService);
    this.frmGroup = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      first: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      middle: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      last: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(100)]),
      phone: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      isActive: new FormControl(),
      resetPassword: new FormControl(),
    });
  }

  init(data: any) {
    super.init(data);
    this.loading(true);
    this.userService.getUserById((data as User).id + 1).subscribe(user => {
      this.loading(false);
      super.init(user);
    }, (ex) => this.errorHandler(ex, {nouser: Locales.invalidRequest}));
  }

  doDelete(): void {

  }

}
