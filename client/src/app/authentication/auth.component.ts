import { Component, NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { environment } from '@client/environments/environment';
import { AppFooterComponentModule } from '../app.footer.component';
import { CommonModule } from '@angular/common';
import Locales from '@locales/auth';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  templateUrl: './auth.component.html',
  styleUrls: [ './auth.component.less' ]
})
export class AuthComponent {
  Locales = Locales;
  routerUrl: string;
  actionUrl: string;
  clientId: string;
  company: string;
  phone: string;
  metars: { [key: string]: any; } = {};
  metarAirports: string[];

  constructor(router: Router, private http: HttpClient) {
    this.routerUrl = router.url;
    this.actionUrl = environment.endpoint + router.url;
    this.clientId = environment.clientId;
    this.company = environment.company;
    this.phone = environment.phone;
    this.metarAirports = environment.metarAirports;
    this.getMetars();

    setInterval(() => this.getMetars, 10 * 60 * 1000);
  }

  getMetars() {
    this.http.get('/dataserver_current/httpparam?format=csv&dataSource=metars&requestType=retrieve&mostRecent=false&hoursBeforeNow=1&stationString=' +
              environment.metarAirports.join(' '), {responseType: 'text'}).subscribe(
      value => {
        const re = /^\w{4} (\d{6}Z.*?),(\w{4}),(.*?),.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,(.*?),/;
        const match = value.match(/^\w{4} \d{6}Z.*?,\w{4},.*?$/gm);
        this.metars = {};
        if (match) {
          match.forEach(val => {
            const groups = re.exec(val);
            if (groups.length === 5) {
              let data = {id: groups[2], date: new Date(groups[3]), ctg: groups[4], raw: groups[1]};
              if (this.metars[data.id]) {
                if (this.metars[data.id].date.getTime() > data.date.getTime()) {
                  data = this.metars[data.id];
                }
              }
              this.metars[data.id] = data;
            } else {
              console.warn(groups);
            }
          });
        }
        console.log(this.metars);
      },
      error => {
        console.error(error);
      }
    );
  }
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AppFooterComponentModule,
    RouterModule.forChild([{
      path: '', component: AuthComponent,
    }]),
  ],
  declarations: [AuthComponent]
})
export class AuthComponentModule { }
