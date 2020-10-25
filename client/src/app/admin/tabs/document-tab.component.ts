import Locales from '@locales/admin';
import { Component, NgModule } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Document } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { DocumentType } from 'src/modules/models/constants';
import { TabBaseDirective, TabBaseModule } from './tabbase.component';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';
import { TableResult } from 'src/modules/models/table.result';
import { AppUtils } from 'src/app/utils/app-utils';

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
    children: { [id: number]: Document[] } = {};

    constructor(confirmationService: ConfirmationService, private adminService: AdminService) {
        super(confirmationService);
        this.controls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'description', header: Locales.description, type: 'input' },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(DocumentType).map(key => ({ label: DocumentType[key], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'url', type: 'hide', template: 'url' },
            { field: 'fileName', header: Locales.fileName, type: 'input', class: 'inlineL' },
            { field: 'password', header: Locales.password, type: 'input', class: 'inlineL' },
            { field: 'filePath', type: 'hide', template: 'path' },
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
        this.onReset();
    }

    updateSelectedBean(bean: any) {
        super.updateSelectedBean(bean);
        if (bean != null) {
            this.loading(true);
            this.adminService.getDocument(this.user.id, bean.id).subscribe(document => {
                this.loading(false);
                this.formGroup.patchValue(document);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.onReset();
        }
    }

    getType(key: any) {
        return DocumentType[key];
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
            if (this.selectedBean) {
                Object.assign(this.selectedBean, result);
            }
            this.formGroup.patchValue(result);
            this.success(document.id ? Locales.recordUpdated : Locales.recordCreated);
        }, (ex) => this.errorHandler(ex));
    }

    doDelete(): void {
        this.loading(true);
        if (this.children[this.selectedBean.id] && this.selectedBean.expanded) {
            this.onToggle(this.selectedBean);
        }
        this.adminService.deleteDocument(this.user.id, this.selectedBean.id).subscribe(_  => {
            this.loading(false);
            this.result.data.forEach((item, idx) => {
                if (this.selectedBean && item.id === this.selectedBean.id) {
                    delete this.children[item.id];
                    const documents = this.children[item.parentId];
                    if (documents) {
                        documents.forEach((child, childIdx) => {
                            if (child.id === item.id) {
                                documents.splice(childIdx, 1);
                                return false;
                            }
                        });
                    }
                    if (item.parentId) {
                        this.result.data.forEach(child => {
                            if (child.id === item.parentId) {
                                child.total--;
                                return false;
                            }
                        });
                    } else {
                        this.result.total--;
                    }
                    this.result.data.splice(idx, 1);
                    this.selectedBean = null;
                    this.success(Locales.recordDeleted);
                    return false;
                }
            });
        }, (ex) => this.errorHandler(ex));
    }

    onNextPageUpload(event: any, error: boolean) {
        const doc = this.doUpload(event, error);
        if (doc) {
            doc.type = this.formGroup.controls.type.value;
            doc.parentId = this.selectedBean.id;
            doc.pageNumber = this.selectedBean.total + 1;
            this.selectedBean.total++;
            this.saveDocument(doc, false);
        }
    }

    onNewUploadDocument(event: any, error: boolean) {
        const doc = this.doUpload(event, error);
        if (doc) {
            doc.type = this.formGroup.controls.type.value;
            doc.total = 1;
            this.result.total++;
            this.saveDocument(doc, true);
        }
    }

    saveDocument(doc: Document, isNew: boolean) {
        this.loading(true);
        this.adminService.saveDocument(this.user.id, doc).subscribe(result => {
            this.loading(false);
            if (isNew) {
                this.result.data.push(result);
            } else {
                if (this.selectedBean && this.children[this.selectedBean.id]) {
                    if (this.selectedBean.expanded) {
                        this.result.data.forEach((item, idx) => {
                            if (item.id === this.selectedBean.id) {
                                this.result.data.splice(idx + this.children[this.selectedBean.id].length + 1, 0, result);
                                return false;
                            }
                        });
                    }
                    this.children[this.selectedBean.id].push(result);
                }
            }
        }, (ex) => this.errorHandler(ex));
    }

    onToggle(doc: any) {
        doc.expanded = !doc.expanded;
        let rowIndex = -1;
        this.result.data.forEach((item, idx) => {
            if (item.id === doc.id) {
                rowIndex = idx;
                return false;
            }
        });
        if (rowIndex === -1) {
            return;
        }
        if (!this.children[doc.id]) {
            this.loading(true);
            this.adminService.lazyDocuments(this.user.id, doc.id).subscribe(result => {
                this.loading(false);
                this.children[doc.id] = result;
                this.result.data.splice(rowIndex + 1, 0, ...result);
            }, (ex) => this.errorHandler(ex));
        } else {
            if (doc.expanded) {
                this.result.data.splice(rowIndex + 1, 0, ...this.children[doc.id]);
            } else {
                this.result.data.splice(rowIndex + 1, this.children[doc.id].length);
            }
        }
    }

    onReset() {
        this.formGroup.patchValue({ type: AppUtils.getKey(DocumentType, 'PilotPicture'), pageNumber: 1, isFrontSide: 1 });
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, TabBaseModule],
    exports: [DocumentTabComponent],
    declarations: [DocumentTabComponent]
})
export class DocumentTabModule {
}
