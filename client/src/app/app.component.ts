import { Component, NgModule, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from '@client/environments/environment';
import Locales from '@locales/common';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(provider: Title) {
    provider.setTitle(environment.company);
  }
}

@Component({
  selector: 'app-overlay',
  host: {class: 'ui-dialog-mask ui-widget-overlay'},
  template: `<div class="app-loading"></div>`
})
export class AppOverlayComponent {
  constructor(private hostElement: ElementRef) {
  }

  display(show: boolean) {
    this.hostElement.nativeElement.style.display = show ? 'block' : 'none';
  }
}

@Component({
  selector: 'app-footer',
  template: `<a [href]="tfrLink" target="_blank">TFR</a> | <a href="https://www.1800wxbrief.com/Website/weatherGraphics?conus=0" target="_blank">1800WXBrief</a> | <a href="https://www.aviationweather.gov" target="_blank">AviationWeather</a> | <a href="https://www.iFlightPlanner.com/AviationCharts/?Map=sectional&GS=115&Route=KRHV" target="_blank">iFlightPlanner</a> | <a href="https://skyvector.com/" target="_blank">Skyvector</a> <div class="powerby">${Locales.powerBy}</div>`
})
export class AppFooterComponent {
  tfrLink = environment.tfrLink;
}

@NgModule({
    imports: [CommonModule],
    exports: [AppOverlayComponent, AppFooterComponent],
    declarations: [AppOverlayComponent, AppFooterComponent]
})
export class AppComponentModule {
}
