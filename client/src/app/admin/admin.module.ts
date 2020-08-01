import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { UserService } from 'src/services/user.service';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { AppComponentModule } from '../app.component';
import { AdminAuthService } from '../authentication/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FTTableModule } from '../component/ft-table.component';

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
    CheckboxModule,
    ButtonModule,
    FTTableModule
  ],
  declarations: [
    AdminComponent
  ],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminAuthService,
      multi: true
    }
  ]
})
export class AdminModule { }
