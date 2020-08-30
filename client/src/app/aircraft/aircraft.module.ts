import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { AppComponentModule } from '../app.component';
import { AuthService } from '../authentication/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AircraftComponent } from './aircraft.component';
import { FTLeftNavModule } from '../component/ft-leftnav/ft-leftnav.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: AircraftComponent
      }
    ]),
    CommonModule,
    HttpClientModule, /*required for HTTP_INTERCEPTORS*/
    ReactiveFormsModule, /*required for FormGroup, FormControl */
    AppComponentModule, /* required for app-header, app-footer */
    FTLeftNavModule
  ],
  declarations: [
    AircraftComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true
    }
  ]
})
export class AircraftModule { }
