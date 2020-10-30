import Locales from '@locales/admin';
import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentModule } from '../app.component';
import { AuthService } from '../authentication/auth.service';

@Component({
    selector: 'admin-topbar',
    template: `<div class="topbar">
                <div class="topbar-left">
                    <app-header></app-header>
                </div>
                <div class="topbar-right">
                    <div style="float: right">
                    <span class="p-overlay-badge">
                        <i class="pi pi-bell" style="font-size: 2em; margin-right: 5px;"></i>
                        <span class="p-badge">2</span>
                    </span>
                    <a style="color: #fff; margin-left: 30px; vertical-align: top" (click)="appService.logout()">{{Locales.logout}}</a>
                    </div>
                </div>
              </div>`,
    styleUrls: ['./admin.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class AdminTopbarComponent {
    Locales = Locales;

    constructor(public appService: AuthService) {
    }
}
@NgModule({
    imports: [CommonModule, AppComponentModule],
    exports: [AdminTopbarComponent],
    declarations: [AdminTopbarComponent]
})
export class AdminTopbarModule {
}
