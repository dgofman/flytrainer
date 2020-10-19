import Locales from '@locales/admin';
import { Component } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';
import { Validators } from '@angular/forms';
import { ColumnType } from 'src/modules/models/constants';

@Component({
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.less']
})
export class BillingComponent extends AppBaseDirective {
  Locales = Locales;

  cols: ColumnType[] = [
    { field: 'id', show: 'never'},
    { field: 'version', show: 'never'},
    { field: 'username', type: 'input', show: true, header: Locales.username, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'first', type: 'input', show: true, header: Locales.firstname, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'middle', type: 'input', header: Locales.middlename, width: 150 },
    { field: 'last', type: 'input', show: true, header: Locales.lastname, width: 150, validators: [Validators.required, Validators.maxLength(50)] },
    { field: 'email', type: 'input', show: true, header: Locales.email, width: 200, validators: [Validators.required, Validators.email, Validators.maxLength(100)] },
  ];

  constructor(public appService: AuthService) {
    super();
  }
}
