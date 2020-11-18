import Locales from '@locales/menu';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlane, faPencilAlt, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { AppUtils } from 'src/app/utils/app-utils';
import { RouterOutlet } from 'src/modules/models/constants';

export const FTIcons = {
    faPlane,
    faInstructor: faChalkboardTeacher,
    faPencil: faPencilAlt,
};

@Component({
    selector: 'ft-menu',
    template: `
    <ul class="nav-menu">
        <li [routerLink]="createLink('users')" *ngIf="isAdmin" (click)="isOpenAdmin = !isOpenAdmin">
            <div>
                <i class="pi pi-unlock"></i>{{Locales.admin}}
                <span class="pi {{isOpenAdmin ? 'pi-folder-open' : 'pi-folder'}}" style="float: right"></span>
            </div>
            <ul class="nav-sub-menu" [style.display]="isOpenAdmin ? 'block' : 'none'">
                <li [routerLink]="createLink('users')" routerLinkActive="active">
                    <div>{{Locales.users}}</div>
                </li>
                <li [routerLink]="createLink('courses')" routerLinkActive="active">
                    <div>{{Locales.courses}}</div>
                </li>
                <li [routerLink]="createLink('tierRates')" routerLinkActive="active">
                    <div>{{Locales.tierRates}}</div>
                </li>
                <li [routerLink]="createLink('aircrafts')" routerLinkActive="active">
                    <div>{{Locales.aircrafts}}</div>
                </li>
                <li [routerLink]="createLink('billing')" routerLinkActive="active">
                    <div>{{Locales.billing}}</div>
                </li>
                <li [routerLink]="createLink('documents')" routerLinkActive="active">
                    <div>{{Locales.documents}}</div>
                </li>
            </ul>
        </li>
        <li routerLink="/dashboard" routerLinkActive="active">
            <div><i class="pi pi-home"></i>{{Locales.dashboard}}</div>
        </li>
        <li routerLink="/schedule" routerLinkActive="active">
            <div><i class="pi pi-calendar"></i>{{Locales.schedule}}</div>
        </li>
        <li routerLink="/instructors" routerLinkActive="active">
            <div><fa-icon [icon]="icons.faInstructor"></fa-icon>{{Locales.instructors}}</div>
        </li>
        <li routerLink="/aircrafts" routerLinkActive="active">
            <div><fa-icon [icon]="icons.faPlane" class="rotate-90"></fa-icon>{{Locales.aircrafts}}</div>
        </li>
        <li routerLink="/billing" routerLinkActive="active">
            <div><i class="pi pi-money-bill"></i>{{Locales.billing}}</div>
        </li>
        <li routerLink="/reports" routerLinkActive="active">
            <div><i class="pi pi-chart-line"></i>{{Locales.reports}}</div>
        </li>
    </ul>`,
    styleUrls: ['./ft-menu.component.less']
})
export class FTMenuComponent {
    Locales = Locales;
    icons = FTIcons;
    isOpenAdmin: boolean;
    path: string;

    constructor(router: Router) {
        this.path = router.url.split('?')[0];
        if (this.path.startsWith('/admin')) {
            this.isOpenAdmin = true;
        }
    }

    createLink(path: string) {
        return RouterOutlet.createLink('/admin', path);
    }

    get isAdmin(): boolean {
        return AppUtils.canViewAdmin();
    }
}

@NgModule({
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  exports: [FTMenuComponent],
  declarations: [FTMenuComponent]
})
export class FTMenuModule {
}
