import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import {TableModule} from 'primeng/table';
import { UserService } from 'src/services/user.service';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { AppComponentModule } from '../app.component';
import { AuthService } from '../authentication/auth.service';
import { CommonModule } from '@angular/common';

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
    AppComponentModule,
    TableModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true
    }
  ]
})
export class DashboardModule { }
