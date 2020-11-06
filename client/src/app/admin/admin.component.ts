import Locales from '@locales/admin';
import { environment } from '@client/environments/environment';
import { Component, NgModule, ViewEncapsulation, Input } from '@angular/core';
import { Document } from 'src/modules/models/base.model';
import { CommonModule } from '@angular/common';
import { AppComponentModule } from '../app.component';
import { AuthService } from '../authentication/auth.service';
import { BaseModel, User } from 'src/modules/models/base.model';
import { FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

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

@Component({
    selector: 'admin-prewview',
    template: `<div class="row" *ngIf="selectedBean?.document as doc">
                    <div *ngIf="doc.id && doc.fileName">
                        <h3>{{Locales.preview}}</h3>
                        <img style="max-width: 100%" src="{{baseURL}}/file/{{user.id}}/{{doc.id}}?token={{token}}" onerror="this.src='assets/no-image-available.jpeg';"/>
                    </div>
                    <div *ngIf="doc.fileName" class="row" style="margin-top: 20px">
                        <button pButton icon="pi pi-times" style="padding: 0; font-size: 9px;" (click)="deleteDocument(doc)"></button>&nbsp;&nbsp;
                        <a href="{{baseURL}}/file/{{user.id}}/{{doc.id}}?token={{token}}" download>{{Locales.download}}</a>&nbsp;&nbsp;
                        <b>{{doc.fileName}}</b> - {{doc.size}} bytes
                    </div>
                </div>`
})
export class AdminPreviewComponent {
    Locales = Locales;
    token = AuthService.token;

    @Input() user: User;
    @Input() formGroup: FormGroup;
    @Input() selectedBean: BaseModel;

    get baseURL() {
        return environment.native ? environment.endpoint : '';
    }

    constructor(public appService: AuthService) {
    }

    deleteDocument(document: Document) {
        if (!document.id) {
            this.selectedBean.document = null;
        } else {
            this.selectedBean.document = new Document({id: document.id});
        }
        this.formGroup.patchValue({document: this.selectedBean.document});
    }
}

@NgModule({
    imports: [CommonModule, ButtonModule, AppComponentModule],
    exports: [AdminTopbarComponent, AdminPreviewComponent],
    declarations: [AdminTopbarComponent, AdminPreviewComponent]
})
export class AdminComponentModule {
}
