import Locales from '@locales/dashboard';
import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.less']
})
export class DashboardComponent extends AppBaseDirective {
  Locales = Locales;

  constructor(changeDetector: ChangeDetectorRef, public appService: AuthService) {
    super(changeDetector);
  }
}
