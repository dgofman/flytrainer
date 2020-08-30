import Locales from '@locales/dashboard';
import { Component } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { AppBaseDirective } from '../app.base.component';

@Component({
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.less']
})
export class InstructorComponent extends AppBaseDirective {
  Locales = Locales;

  constructor(public appService: AuthService) {
    super();
  }
}
