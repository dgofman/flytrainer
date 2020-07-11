import { Component } from '@angular/core';
import { AppService } from './app.service';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  env = environment;
  postRequestResponse: string;

  toggleArroMenu: boolean;

  cars = [
        {brand: 'VW', year: 2012, color: 'Orange', vin: 'dsad231ff'},
        {brand: 'Audi', year: 2011, color: 'Black', vin: 'gwregre345'}
    ];

  constructor(titleService: Title, private appService: AppService) {
    titleService.setTitle(environment.title);
    this.appService.getWelcomeMessage().subscribe((data: any) => {
      console.log(data.content);
    });
  }



  /**
   * This method is used to test the post request
   */
  public postData(): void {
    this.appService.sendData().subscribe((data: any) => {
      this.postRequestResponse = data.content;
    });
  }
}
