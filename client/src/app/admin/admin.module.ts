import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserService } from 'src/services/user.service';
import { AdminService } from 'src/services/admin.service';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { AppComponentModule } from '../app.component';
import { AdminAuthService } from '../authentication/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FTTableModule } from '../component/ft-table/ft-table.component';
import { FTMenuModule } from '../component/ft-menu/ft-menu.component';
import { FTDialogvModule } from '../component/ft-dialog/ft-dialog.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { FTPipeModule } from '../utils/pipes';
import { AddressTabModule } from './tabs/address-tab.component';
import { CertificateTabModule } from './tabs/certificate-tab.component';
import { DocumentTabModule } from './tabs/document-tab.component';
import { TempTabsModule } from './tabs/temp.tabs.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: AdminComponent
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
    CertificateTabModule,
    DocumentTabModule,
    FTDialogvModule,
    FTMenuModule,
    FTTableModule,
    FTPipeModule
  ],
  declarations: [
    AdminComponent
  ],
  providers: [
    ConfirmationService,
    UserService,
    AdminService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminAuthService,
      multi: true
    }
  ]
})
export class AdminModule { }
