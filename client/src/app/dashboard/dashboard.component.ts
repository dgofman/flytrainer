import { Component } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';
import Locales from '@locales/dashboard';
import { environment } from '@client/environments/environment';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.less' ]
})
export class DashboardComponent {
  Locales = Locales;
  postRequestResponse: string;
  user: User = new User();
  toggleArroMenu: boolean;

  company: string;
  phone: string;

  cars = [
    { brand: 'VW', year: 2012, color: 'Orange', vin: 'dsad231ff' },
    { brand: 'Audi', year: 2011, color: 'Black', vin: 'gwregre345' }
  ];

  constructor(private userService: UserService) {
    this.company = environment.company;
    this.phone = environment.phone;
    this.userService.getUser().subscribe(user => {
      this.user = user;
      console.log(User.serialize(this.user));
    });
  }
}
