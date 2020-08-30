import Locales from '@locales/dashboard';
import { Component } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';

@Component({
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.less']
})
export class ScheduleComponent extends AppBaseDirective {
  Locales = Locales;

  constructor(public appService: AuthService) {
    super();
  }
}
