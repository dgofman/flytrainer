import Locales from '@locales/common';
import { CommonModule } from '@angular/common';
import { Component, NgModule, Input } from '@angular/core';
import { Session } from 'src/modules/models/constants';
import { AppUtils } from 'src/app/utils/app-utils';
import { AuthService } from 'src/app/authentication/auth.service';
import { FTMenuModule } from '../ft-menu/ft-menu.component';

@Component({
    selector: 'ft-leftnav',
    template: `
      <div class="profile">
        {{session.lastname}}, {{session.firstname}} ({{session.id}})
        <br><b>{{Locales.accountBalance}}:</b><span
          style="padding-left: 10px;">{{0 | currency}}</span>
        <br><a style="float: right" (click)="appService.logout()">{{Locales.logout}}</a>
      </div>
      <ft-menu [link]="link"></ft-menu>
    `,
    styles: [`
        .profile {
            overflow: auto;
            padding: 15px;
            line-height: 25px;
            -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.15);
            -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.15);
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.15);
        }
      }
    `]

})
export class FTLeftNavComponent {
    Locales = Locales;
    session: Session;

    @Input('link') link: string;

    constructor(public appService: AuthService) {
      this.session = AppUtils.getSession();
    }
}

@NgModule({
  imports: [CommonModule, FTMenuModule],
  exports: [FTLeftNavComponent],
  declarations: [FTLeftNavComponent]
})
export class FTLeftNavModule {
}
