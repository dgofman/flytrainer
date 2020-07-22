import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {TableModule} from 'primeng/table';
import { UserService } from 'src/services/user.service';
import { DashboardComponent } from './dashboard.component';
import { AuthHttpInterceptor } from '../authentication/auth-http-interceptor';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponentModule } from '../app.component';

export const routes: Routes = [
  {
    path: '', component: DashboardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    HttpClientModule,
    AppComponentModule,
    TableModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    UserService,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor
    }
  ]
})
export class DashboardModule { }
