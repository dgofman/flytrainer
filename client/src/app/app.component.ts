import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '@client/environments/environment';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(provider: Title) {
    provider.setTitle(environment.company);
  }
}
