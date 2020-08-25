import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserService } from 'src/services/user.service';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { AppComponentModule } from '../app.component';
import { AdminAuthService } from '../authentication/auth.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FTTableModule } from '../component/ft-table.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserFormComponent } from './userform.component';
import { ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FTPipeModule } from '../utils/pipes';

export const routes: Routes = [
  {
    path: '', component: AdminComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    HttpClientModule, /*required for HTTP_INTERCEPTORS*/
    ReactiveFormsModule, /*required for FormGroup, FormControl */
    AppComponentModule, /* required for app-footer */
    FontAwesomeModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    ButtonModule,
    ConfirmDialogModule,
    FTTableModule,
    FTPipeModule
  ],
  declarations: [
    AdminComponent, UserFormComponent
  ],
  providers: [
    ConfirmationService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminAuthService,
      multi: true
    }
  ]
})
export class AdminModule { }
