import Locales from '@locales/admin';
import { Component, NgModule } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Document } from 'src/modules/models/document';
import { AdminService } from 'src/services/admin.service';
import { DocumentType } from 'src/modules/models/constants';
import { TabBaseDirective, TabBaseModule } from './tabbase.component';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';
import { TableResult } from 'src/modules/models/table.result';

@Component({
    selector: 'document-tab',
    templateUrl: './document-tab.component.html',
    styles: [
        `::ng-deep .document .ui-table table {
            table-layout: auto;
        }`
    ]
})
export class DocumentTabComponent extends TabBaseDirective {
    result: TableResult<Document>;

    constructor(confirmationService: ConfirmationService, private adminService: AdminService) {
        super(confirmationService);
        this.controls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'description', header: Locales.description, type: 'input' },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], placeholder: Locales.selDocumentType, value: Object.keys(DocumentType).map(key => ({ label: DocumentType[key][1], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'url', type: 'hide' },
            { field: 'fileName', header: Locales.name, type: 'input', class: 'inlineL' },
            { field: 'password', header: Locales.password, type: 'input', class: 'inlineL' },
            { field: 'filePath', header: Locales.path, type: 'input', class: 'disabled' },
            { field: 'size', header: Locales.size, type: 'input', class: 'inlineL disabled' },
            { field: 'contentType', header: Locales.contentType, type: 'input', class: 'inlineR disabled' },
            { field: 'issuedDate', header: Locales.issuedDate, type: 'cal', value: this.AppUtils.defaultYearRange, class: 'inlineL' },
            { field: 'expDate', header: Locales.expDate, type: 'cal', value: this.AppUtils.defaultYearRange, class: 'inlineR' },
            { field: 'modifiedDate', header: Locales.modifiedDate, type: 'input', value: this.AppUtils.defaultYearRange, format: 'datetime', class: 'inlineL disabled' },
            { field: 'createdDate', header: Locales.createdDate, type: 'input', value: this.AppUtils.defaultYearRange, format: 'datetime', class: 'inlineR disabled' },
            { field: 'pageNumber', header: Locales.pageNumber, type: 'number', validators: [Validators.required], value: [1, 999] },
            { field: 'isFrontSide' },
            { field: 'isSuspended' },
            { field: 'isWithdrawn' },
        ];
        const controls = {};
        this.controls.forEach(c => {
            controls[c.field] = new FormControl(null, c.validators);
        });
        this.formGroup = new FormGroup(controls);
        this.formGroup.patchValue({ pageNumber: 1, isFrontSide: 1 });
    }

    updateSelectedBean(bean: any) {
        super.updateSelectedBean(bean);
        this.loading(true);
        this.adminService.getDocument(this.user.id, bean.id).subscribe(document => {
            this.loading(false);
            this.formGroup.patchValue(document);
        }, (ex) => this.errorHandler(ex));
    }

    lazyLoad(event?: LazyLoadEvent) {
        this.loading(true);
        this.adminService.getDocuments(this.user.id, event.first).subscribe(result => {
            this.loading(false);
            this.result = result;
        }, (ex) => this.errorHandler(ex));
    }

    onSubmit() {
        const document = new Document(this.formGroup.value as any);
        this.loading(true);
        this.adminService.saveDocument(this.user.id, document).subscribe(result => {
            this.loading(false);
            this.selectedBean = result;
            this.formGroup.patchValue(result);
            this.success(document.id ? Locales.recordUpdated : Locales.recordCreated);
        }, (ex) => this.errorHandler(ex));
    }

    doDelete(): void {
        this.loading(true);
        this.adminService.deleteDocument(this.user.id, this.selectedBean.id).subscribe(_  => {
            this.loading(false);
            this.result.data.forEach((item, idx) => {
                if (item.id === this.selectedBean.id) {
                    this.result.data.splice(idx, 1);
                    super.onReset();
                    this.success(Locales.recordDeleted);
                    return false;
                }
            });
        }, (ex) => this.errorHandler(ex));
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, TabBaseModule],
    exports: [DocumentTabComponent],
    declarations: [DocumentTabComponent]
})
export class DocumentTabsModule {
}
