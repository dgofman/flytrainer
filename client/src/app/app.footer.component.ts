import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import Locales from '@locales/common';

@Component({
  selector: 'app-footer',
  template: `<a href="https://www.1800wxbrief.com/Website/" target="_blank">1800WXBrief</a> | <a href="https://www.iFlightPlanner.com/AviationCharts/?Map=sectional&GS=115&Route=KRHV" target="_blank">iFlightPlanner</a> | <a href="https://skyvector.com/" target="_blank">Skyvector</a> <span class="powerby">${Locales.powerBy}</span>`
})
export class AppFooterComponent {}

@NgModule({
    imports: [CommonModule],
    exports: [AppFooterComponent],
    declarations: [AppFooterComponent]
})
export class AppFooterComponentModule {
}
