import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/services/UserService';
import { User } from 'src/modules/models/user';
import Locales from '@locales/dashboard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  Locales = Locales;
  env = environment;
  postRequestResponse: string;
  user: User = new User();
  toggleArroMenu: boolean;

  cars = [
        {brand: 'VW', year: 2012, color: 'Orange', vin: 'dsad231ff'},
        {brand: 'Audi', year: 2011, color: 'Black', vin: 'gwregre345'}
    ];

  constructor(titleService: Title, private userService: UserService) {
    titleService.setTitle(environment.title);
    this.userService.getUser().subscribe(user => this.user = user);
  }
}
