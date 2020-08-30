import Locales from '@locales/dashboard';
import { Component } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';

@Component({
  templateUrl: './aircraft.component.html',
  styleUrls: ['./aircraft.less']
})
export class AircraftComponent extends AppBaseDirective {
  Locales = Locales;

  constructor(public appService: AuthService) {
    super();
  }
}
