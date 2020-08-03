import Locales from '@locales/admin';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { AdminFormDirective } from '../component/ft-table-form.component';
import { FTTableFormProviderDirective } from '../component/ft-table.component';

@Component({
  templateUrl: './userform.component.html'
})
export class UserFormComponent extends AdminFormDirective {
  Locales = Locales;


  constructor(formProvider: FTTableFormProviderDirective, confirmationService: ConfirmationService) {
    super(formProvider, confirmationService);
    this.frmGroup = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      firstname: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      lastname: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(100)]),
      phonenumber: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(100)]),
      isActive: new FormControl(),
      resetPassword: new FormControl(),
    });
  }

  doDelete(): void {

  }

}
