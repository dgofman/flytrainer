import Locales from '@locales/auth';
import { environment } from '@client/environments/environment';
import { Component, NgModule, AfterViewInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponentModule } from '../app.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { AppUtils } from '../utils/app-utils';

@Component({
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less'],
  styles: [`
    .row {
      margin-bottom: 1em;
    }
  `]
})
export class AuthComponent implements AfterViewInit {
  Locales = Locales;
  environment = environment;
  resetPassword: boolean;
  path: string;
  worldtime: any = {};
  currentDateTime: Date;
  metars: { [key: string]: any; } = {};
  metarAirports: string[];

  message: string;
  error: string;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private appService: AuthService) {
    this.path = router.url.split('?')[0];
    this.metarAirports = environment.metarAirports;
    this.currentDateTime = new Date();
    this.message = Locales.pleaseWait;

    if (this.path === '/login') {
        appService.reset();
    }

    try {
      this.worldtime.abbreviation = this.currentDateTime.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];
    } catch (e) {
    }

    http.get('/timezone/' + environment.timezone).subscribe(value => {
      this.worldtime = value;
      this.currentDateTime = new Date(this.worldtime.utc_datetime);
    }, (ex) => console.error(ex));

    setInterval(() => this.currentDateTime = new Date(this.currentDateTime.getTime() + 1000), 1000);
  }

  ngAfterViewInit(): void {
    if (this.path === '/login') {
      setInterval(() => this.getMetars(), 10 * 60 * 1000);
      this.getMetars();
    } else if (this.path === '/activate') {
      const params = this.route.queryParams as any;
      if (Object.keys(params._value).length) {
        AppUtils.loading(true);
        this.http.post(this.path, Object.assign({ cid: this.environment.clientId, cip: this.worldtime.client_ip }, params._value)).subscribe(_ => {
          AppUtils.loading(false);
          this.message = Locales.accountActivated;
        }, (ex) => this.errorHandler(ex));
      } else {
        this.errorHandler({ error: Locales.internalError });
      }
    }
  }

  getMetars() {
    this.http.get('/dataserver_current/httpparam?format=csv&dataSource=metars&requestType=retrieve&mostRecent=false&hoursBeforeNow=' +
      environment.metarHoursBeforeNow + '&stationString=' + environment.metarAirports.join(' '), { responseType: 'text' }).subscribe(
        value => {
          const re = /^\w{4} (\d{6}Z.*?),(\w{4}),(.*?),.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,(.*?),/;
          const match = value.match(/^\w{4} \d{6}Z.*?,\w{4},.*?$/gm);
          this.metars = {};
          if (match) {
            match.forEach(val => {
              const groups = re.exec(val);
              if (groups.length === 5) {
                let data = { id: groups[2], date: new Date(groups[3]), ctg: groups[4], raw: groups[1] };
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
        }, (ex) => console.error(ex));
  }

  onSubmit(form: any) {
    this.error = null;
    if (form.valid) {
      const params = this.route.queryParams as any;
      const data = form.value;
      if (data.conf_passwd) {
        if (!(data.conf_passwd === data.new_passwd || data.conf_passwd === data.passwd)) {
          this.errorHandler({ error: Locales.confirmPasswordError });
          return;
        }
      }
      delete data.conf_passwd;
      AppUtils.loading(true);
      this.http.post(this.path, Object.assign({ cid: this.environment.clientId, cip: this.worldtime.client_ip }, params._value, data)).subscribe((json: any) => {
        AppUtils.loading(false);
        switch (this.path) {
          case '/login':
            if (json.token) {
              this.appService.login(json);
              this.router.navigate([AppUtils.canViewAdmin() ? '/admin' : '/dashboard']);
            } else {
              this.resetPassword = true;
            }
            break;
          case '/create':
          case '/forgot':
            this.message = Locales.activationInstruction;
            this.path = '/activate';
            break;
          case '/activate':
            this.message = Locales.accountActivated;
            break;
          case '/reset':
            this.message = Locales.passwordUpdated;
            this.path = '/activate';
            break;
        }
      }, (ex) => this.errorHandler(ex));
    }
  }

  errorHandler(ex: any) {
        AppUtils.loading(false);
        this.message = null;
        if (ex.status === 404 || ex.status % 500 < 50 || !ex.error) {
            this.error = Locales.internalError;
        } else {
            this.error = typeof(ex.error) === 'string' ? ex.error : JSON.stringify(ex.error);
        }
    }
}

@Pipe({ name: 'formatRaw' })
export class FormatRaw implements PipeTransform {
  transform(val: string): string {
    if (val !== null && val.length > 7) {
      return val.substring(0, 2) + '<b><u>' + val.substring(2, 6) + '</u></b>' + val.substring(6);
    }
    return val;
  }
}

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    AppComponentModule,
    RouterModule.forChild([{
      path: '', component: AuthComponent,
    }]),
  ],
  declarations: [AuthComponent, FormatRaw],
  providers: [
  {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true
  }],
})
export class AuthComponentModule { }

