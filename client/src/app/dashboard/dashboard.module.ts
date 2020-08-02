import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { AppComponentModule } from '../app.component';
import { AuthService } from '../authentication/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FTTableModule } from '../component/ft-table.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export const routes: Routes = [
  {
    path: '', component: DashboardComponent
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
    ButtonModule,
    FTTableModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true
    }
  ]
})
export class DashboardModule { }
