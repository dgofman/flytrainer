import Locales from '@locales/menu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, NgModule, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlane, faPencilAlt, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { AppUtils } from 'src/app/utils/app-utils';

export const FTIcons = {
    faPlane,
    faInstructor: faChalkboardTeacher,
    faPencil: faPencilAlt,
};

@Component({
    selector: 'ft-menu',
    template: `
    <ul class="nav-menu">
        <li routerLink="../admin" *ngIf="isAdmin" [class]="getClass('admin')">
            <i class="pi pi-unlock"></i>{{Locales.admin}}
        </li>
        <li routerLink="../dashboard" [class]="getClass('dashboard')">
            <i class="pi pi-home"></i>{{Locales.dashboard}}
        </li>
        <li routerLink="../schedule" [class]="getClass('schedule')">
            <i class="pi pi-calendar"></i>{{Locales.schedule}}
        </li>
        <li routerLink="../instructors" [class]="getClass('instructors')">
            <fa-icon [icon]="icons.faInstructor"></fa-icon>{{Locales.instructors}}
        </li>
        <li routerLink="../aircrafts" [class]="getClass('aircrafts')">
            <fa-icon [icon]="icons.faPlane" class="rotate-90"></fa-icon>{{Locales.aircrafts}}
        </li>
        <li routerLink="../billing" [class]="getClass('billing')">
            <i class="pi pi-money-bill"></i>{{Locales.billing}}
        </li>
        <li routerLink="../reports" [class]="getClass('reports')">
            <i class="pi pi-chart-line"></i>{{Locales.reports}}
        </li>
    </ul>`,
    styleUrls: ['./ft-menu.component.less']
})
export class FTMenuComponent {
    Locales = Locales;
    icons = FTIcons;

    @Input('link') link: string;

    get isAdmin(): boolean {
        return AppUtils.canViewAdmin();
    }

    getClass(link: string): string {
        return this.link === link ? 'selected' : null;
    }
}

@NgModule({
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  exports: [FTMenuComponent],
  declarations: [FTMenuComponent]
})
export class FTMenuModule {
}
