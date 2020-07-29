import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { User } from 'src/modules/models/user';
import { AuthService } from '../authentication/auth.service';
import { environment } from '@client/environments/environment';
import Locales from '@locales/dashboard';
import { AppBaseComponent } from '../app.base.component';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.less' ]
})
export class DashboardComponent extends AppBaseComponent implements OnInit {
  Locales = Locales;
  postRequestResponse: string;
  loggedUser: User = new User();
  users: User[];
  toggleArroMenu: boolean;

  company: string;
  phone: string;

  constructor(changeDetector: ChangeDetectorRef, private userService: UserService,  public appService: AuthService) {
    super(changeDetector);
    this.company = environment.company;
    this.phone = environment.phone;
    const auth = JSON.parse(sessionStorage.getItem('auth_data'));
    this.loggedUser = new User(auth);
  }

  ngOnInit(): void {
    this.userService.getUser(0, 20, 'username').subscribe(users => {
      this.users = users;
    }, (ex) => this.errorHandler(ex));
  }
}
