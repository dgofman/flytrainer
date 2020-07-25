import { Component, NgModule, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { environment } from '@client/environments/environment';
import { CommonModule } from '@angular/common';
import Locales from '@locales/auth';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponentModule } from '../app.component';
import { FormsModule } from '@angular/forms';
import { AuthHttpInterceptor } from './auth-http-interceptor';

@Component({
  templateUrl: './auth.component.html',
  styleUrls: [ './auth.component.less' ]
})
export class AuthComponent implements AfterViewInit {
  Locales = Locales;
  environment = environment;
  resetPassword  = false;
  path: string;
  company: string;
  phone: string;
  error: string;
  message: string;
  worldtime: any = {};
  currentDateTime: Date;
  metars: { [key: string]: any; } = {};
  metarAirports: string[];

  @ViewChild('overlay')
  overlay: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.path = router.url.split('?')[0];
    this.company = environment.company;
    this.phone = environment.phone;
    this.metarAirports = environment.metarAirports;
    this.currentDateTime = new Date();
    this.message = Locales.pleaseWait;

    try {
      this.worldtime.abbreviation = this.currentDateTime.toLocaleTimeString('en-us', {timeZoneName: 'short'}).split(' ')[2];
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
      this.overlay.nativeElement.style.display = 'block';
      this.http.post(this.path, Object.assign({cid: this.environment.clientId, cip: this.worldtime.client_ip}, params._value)).subscribe(_ => {
        this.overlay.nativeElement.style.display = 'none';
        this.message = Locales.accountActivated;
      }, (ex) => this.errorHandler(ex));
    }
  }

  getMetars() {
    this.http.get('/dataserver_current/httpparam?format=csv&dataSource=metars&requestType=retrieve&mostRecent=false&hoursBeforeNow=' +
      environment.metarHoursBeforeNow + '&stationString=' + environment.metarAirports.join(' '), {responseType: 'text'}).subscribe(
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
      }, (ex) => console.error(ex));
  }

  onSubmit(form: any) {
    this.error = null;
    if (form.valid) {
      const data = form.value;
      if (data.conf_passwd) {
        if ((this.resetPassword && data.conf_passwd !== data.new_passwd) ||
            (!this.resetPassword && data.conf_passwd !== data.passwd)) {
          this.errorHandler({error: Locales.confirmPasswordError});
          return;
        }
      }
      delete data.conf_passwd;
      this.overlay.nativeElement.style.display = 'block';
      this.http.post(this.path, Object.assign({cid: this.environment.clientId, cip: this.worldtime.client_ip}, data)).subscribe((value: any) => {
        this.overlay.nativeElement.style.display = 'none';
        switch (this.path) {
          case '/login':
            if (value.token) {
              AuthHttpInterceptor.AUTH_TOKEN = value.token;
              this.router.navigate(['/dashboard']);
            } else {
              this.resetPassword = true;
            }
            break;
          case '/create':
            this.message = Locales.accountActivation;
            this.path = '/activate';
            break;
          case '/activate':
            this.message = Locales.accountActivated;
            break;
        }
      }, (ex) => this.errorHandler(ex));
    }
  }

  errorHandler(ex: any) {
    this.message = null;
    this.overlay.nativeElement.style.display = 'none';
    if (ex.status === 404 || ex.status % 500 < 50 || !ex.error) {
      this.error = Locales.internalError;
    } else {
      this.error = ex.error;
    }
  }
}

@Pipe({name: 'formatRaw'})
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
  declarations: [AuthComponent, FormatRaw]
})
export class AuthComponentModule { }




