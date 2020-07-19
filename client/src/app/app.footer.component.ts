import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import Locales from '@locales/common';

@Component({
  selector: 'app-footer',
  template: `<span class="powerby">${Locales.powerBy}</span>`
})
export class AppFooterComponent {}

@NgModule({
    imports: [CommonModule],
    exports: [AppFooterComponent],
    declarations: [AppFooterComponent]
})
export class AppFooterComponentModule {
}
