import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  templateUrl: './reset.component.html'
})
export class ResetComponent {
}

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '', component: ResetComponent,
    }]),
  ],
  declarations: [ResetComponent]
})
export class ResetComponentModule { }
