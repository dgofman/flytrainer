import { Component, NgModule, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { environment } from '@client/environments/environment';
import { AppFooterComponentModule } from '../app.footer.component';
import { CommonModule } from '@angular/common';
import Locales from '@locales/auth';

@Component({
  templateUrl: './auth.component.html',
  styles: [
    `.dialog {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1);
        padding: 20px;
        max-width: 500px;
        margin: 20px auto;
        overflow: hidden;
    }`
  ]
})
export class AuthComponent {
  Locales = Locales;
  routerUrl: string;
  actionUrl: string;
  clientId: string;
  company: string;
  phone: string;

  constructor(router: Router) {
    this.routerUrl = router.url;
    this.actionUrl = environment.endpoint + router.url;
    this.clientId = environment.clientId;
    this.company = environment.company;
    this.phone = environment.phone;
  }
}

@NgModule({
  imports: [
    CommonModule,
    AppFooterComponentModule,
    RouterModule.forChild([{
      path: '', component: AuthComponent,
    }]),
  ],
  declarations: [AuthComponent]
})
export class AuthComponentModule { }
