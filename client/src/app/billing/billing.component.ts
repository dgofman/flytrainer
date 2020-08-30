import Locales from '@locales/dashboard';
import { Component } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';

@Component({
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.less']
})
export class BillingComponent extends AppBaseDirective {
  Locales = Locales;

  constructor(public appService: AuthService) {
    super();
  }
}
