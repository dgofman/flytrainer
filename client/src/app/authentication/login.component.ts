import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
}

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '', component: LoginComponent,
    }]),
  ],
  declarations: [LoginComponent]
})
export class LoginComponentModule { }
