import Locales from '@locales/dashboard';
import { Component } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.less']
})
export class DashboardComponent extends AppBaseDirective {
  Locales = Locales;

  constructor(public appService: AuthService) {
    super();
  }
}
