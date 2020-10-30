import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminService } from 'src/services/admin.service';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterOutlet } from 'src/modules/models/constants';
import { FTPipeModule } from '../utils/pipes';
import { AdminTopbarModule } from './admin.component';
import { UserComponent } from './user.component';
import { TierRateComponent } from './tierrate.component';
import { UserTabModule } from './usertabs/user-tab.component';
import { AccountTabModule } from './usertabs/account-tab.component';
import { AddressTabModule } from './usertabs/address-tab.component';
import { ContactTabModule } from './usertabs/contact-tab.component';
import { DocumentTabModule } from './usertabs/document-tab.component';
import { CertificateTabModule } from './usertabs/certificate-tab.component';
import { CourseTabModule } from './usertabs/course-tab.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      Object.assign(RouterOutlet.defineLink('', UserComponent), { redirectTo: 'users', pathMatch: 'full' }),
      RouterOutlet.defineLink('users', UserComponent),
      RouterOutlet.defineLink('accounts', UserComponent),
      RouterOutlet.defineLink('tierRates', TierRateComponent),
      RouterOutlet.defineLink('aircrafts', UserComponent),
      RouterOutlet.defineLink('billing', UserComponent),
      RouterOutlet.defineLink('documents', UserComponent)
    ]),
    AdminTopbarModule,
    CommonModule,
    HttpClientModule, /*required for HTTP_INTERCEPTORS*/
    ReactiveFormsModule, /*required for FormGroup, FormControl */
    AppComponentModule, /* required for app-header, app-footer */
    FontAwesomeModule,
    ConfirmDialogModule,
    AddressTabModule,
    ContactTabModule,
    CertificateTabModule,
    CourseTabModule,
    DocumentTabModule,
    UserTabModule,
    AccountTabModule,
    FTDialogvModule,
    FTLeftNavModule,
    FTTableModule,
    FTPipeModule
  ],
  declarations: [
    UserComponent,
    TierRateComponent
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
