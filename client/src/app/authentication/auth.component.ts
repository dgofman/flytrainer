import { Component, NgModule, ElementRef, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { environment } from '@client/environments/environment';
import { CommonModule } from '@angular/common';
import Locales from '@locales/auth';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponentModule } from '../app.component';
import { FormsModule } from '@angular/forms';

@Component({
  templateUrl: './auth.component.html',
  styleUrls: [ './auth.component.less' ]
})
export class AuthComponent {
  Locales = Locales;
  clientId: string;
  company: string;
  phone: string;
  error: string;
  worldtime: any = {};
  currentDateTime: Date;
  metars: { [key: string]: any; } = {};
  metarAirports: string[];

  @ViewChild('overlay')
  overlay: ElementRef;

  constructor(public router: Router, private http: HttpClient) {
    this.clientId = environment.clientId;
    this.company = environment.company;
    this.phone = environment.phone;
    this.metarAirports = environment.metarAirports;
    this.currentDateTime = new Date();

    try {
      this.worldtime.timezone = this.currentDateTime.toLocaleTimeString('en-us', {timeZoneName: 'short'}).split(' ')[2];
    } catch (e) {
    }

    http.get('/timezone/' + environment.timezone).subscribe(value => {
        this.worldtime = value;
        this.currentDateTime = new Date(this.worldtime.utc_datetime);
    }, (ex) => this.errorHandler(ex));

    setInterval(() => this.currentDateTime = new Date(this.currentDateTime.getTime() + 1000), 1000);
    setInterval(() => this.getMetars(), 10 * 60 * 1000);
    this.getMetars();
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
      }, (ex) => this.errorHandler(ex));
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.overlay.nativeElement.style.display = 'block';
      this.http.post(this.router.url, Object.assign({cid: this.clientId, cip: this.worldtime.client_ip}, form.value)).subscribe(value => {
        console.log(value);
      }, (ex) => this.errorHandler(ex));
    }
  }

  errorHandler(ex: any) {
    this.overlay.nativeElement.style.display = 'none';
    if (ex.status === 404 || ex.status % 500 < 50 || !ex.error) {
      this.error = Locales.internalError;
    } else {
      this.error = ex.error;
    }
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
  declarations: [AuthComponent]
})
export class AuthComponentModule { }
