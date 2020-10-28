import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminService } from 'src/services/admin.service';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { AppComponentModule } from '../app.component';
import { AdminAuthService } from '../authentication/auth.service';
import { EventService } from 'src/services/event.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FTTableModule } from '../component/ft-table/ft-table.component';
import { FTLeftNavModule } from '../component/ft-leftnav/ft-leftnav.component';
import { FTDialogvModule } from '../component/ft-dialog/ft-dialog.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { FTPipeModule } from '../utils/pipes';
import { TempTabsModule } from './tabs/temp.tabs.module';
import { UserTabModule } from './tabs/user-tab.component';
import { AccountTabModule } from './tabs/account-tab.component';
import { AddressTabModule } from './tabs/address-tab.component';
import { ContactTabModule } from './tabs/contact-tab.component';
import { DocumentTabModule } from './tabs/document-tab.component';
import { CertificateTabModule } from './tabs/certificate-tab.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: AdminComponent
      },
      {
        path: 'users', component: AdminComponent
      },
      {
        path: 'accounts', component: AdminComponent
      },
      {
        path: 'tierRates', component: AdminComponent
      },
      {
        path: 'aircrafts', component: AdminComponent
      },
      {
        path: 'billing', component: AdminComponent
      },
      {
        path: 'documents', component: AdminComponent
      }
    ]),
    CommonModule,
    HttpClientModule, /*required for HTTP_INTERCEPTORS*/
    ReactiveFormsModule, /*required for FormGroup, FormControl */
    AppComponentModule, /* required for app-header, app-footer */
    FontAwesomeModule,
    ConfirmDialogModule,
    TempTabsModule,
    AddressTabModule,
    ContactTabModule,
    CertificateTabModule,
    DocumentTabModule,
    UserTabModule,
    AccountTabModule,
    FTDialogvModule,
    FTLeftNavModule,
    FTTableModule,
    FTPipeModule
  ],
  declarations: [
    AdminComponent
  ],
  providers: [
    ConfirmationService,
    EventService,
    AdminService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminAuthService,
      multi: true
    }
  ]
})
export class AdminModule { }
