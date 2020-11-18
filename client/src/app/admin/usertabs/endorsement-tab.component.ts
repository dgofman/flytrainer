import Locales from '@locales/admin';
import endorsements from '@locales/endorsement';
import { Component, NgModule, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { CommonModel, Note } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { UserTabBaseDirective, UserTabBaseModule } from '../user.component';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AppUtils } from 'src/app/utils/app-utils';
import { AdminSharedModule } from '../admin-shared.module';
import { TableResult } from 'src/modules/models/table.result';
import { EndorsementType, CertificateType, DocumentType } from 'src/modules/models/constants';

@Component({
    selector: 'endorsement-tab',
    templateUrl: './endorsement-tab.component.html',
    styles: [
        `p.row {
            cursor: pointer;
            font-weight: bold;
        }
        .right {
            .float: right;
        }
        `
    ]
})
export class EndorsementTabComponent extends UserTabBaseDirective implements OnInit {
    result: TableResult<CommonModel>;
    endorsements = endorsements;
    certificates: any[];
    selectedCFI: any;

    @ViewChild('sample') sample: ElementRef;

    constructor(confirmationService: ConfirmationService, formBuilder: FormBuilder, private adminService: AdminService) {
        super(confirmationService, formBuilder);
        this.controls = [
            { field: 'document' },
            { field: 'signed' },
            { field: 'description', header: Locales.description, type: 'input', maxlen: 30 },
            { field: 'type', header: Locales.type, type: 'auto', validators: [Validators.required], value: EndorsementType },
            { field: 'other', type: 'hide' },
            { field: 'limitations', header: Locales.limitations, maxlen: 100, type: 'input' },
            { field: 'issuedDate', header: Locales.issuedDate, type: 'cal', class: 'inlineL' },
            { field: 'expDate', header: Locales.expDate, type: 'cal', class: 'inlineR' },
            { field: 'isCanceled', header: Locales.isCanceled, type: 'switch' },
        ];
        this.initFormGroup();
        let oldValue = null;
        this.formGroup.valueChanges.subscribe(val => {
            let type = '', title = '', text = '';
            if (val.type === EndorsementType.Other && oldValue !== val.other) {
                type = EndorsementType.Other;
                title = (oldValue = val.other) || '';
            } else if (val.type && typeof val.type !== 'string' && oldValue !== val.type.data) {
                type = oldValue = val.type.data,
                title = endorsements[type + 'Title'] || val.type.label;
                text = endorsements[type] || '';
                text = text.replace('[First name, MI, Last name]', this.user.first + ', ' + (this.user.middle ? this.user.middle + ', ' : '') + this.user.last);
                if (this.user.sex) {
                    text = text.replace('[he or she]', this.user.sex === 'M' ? 'he' : 'she');
                }
            } else {
                return;
            }
            val.notes.content = '<b style="font-size: 16px">' + title + '</b><hr><br><p style="font-size: 14px">' + text + '</p>';
            this.formGroup.patchValue({type, notes: val.notes});
        });
   }

   ngOnInit(): void {
       this.adminService.findCFICertificates().subscribe(data => {
            this.certificates = data.map(d => ({ label: d.cfiName + ' - ' + (d.other || CertificateType[d.type]), data: d }));
        });
   }

    lazyLoad(event?: LazyLoadEvent) {
        this.loading(true);
        this.adminService.getEndorsements(this.user.id, event.first).subscribe(result => {
            this.loading(false);
            this.result = result;
        }, (ex) => this.errorHandler(ex));
    }

    onSign() {
        this.formGroup.patchValue({issuedDate: new Date(), signed: this.selectedCFI});
    }

    onCFISelected(event: any) {
        this.selectedCFI = event.data;
    }

    getType(type: string) {
        return EndorsementType[type];
    }

    onPrint() {
        const iframe = document.createElement('IFRAME') as any;
        iframe.domain = document.domain;
        iframe.style.position = 'absolute';
        iframe.style.top = '-10000px';
        document.body.appendChild(iframe);
        iframe.contentDocument.write('<html><link href="http://fonts.googleapis.com/css?family=Great+Vibes" rel="stylesheet" type="text/css"><body>' + this.sample.nativeElement.innerHTML + '</body></html>');
        const interval = setInterval(() => {
            if (iframe.contentWindow.document.styleSheets.length) {
                clearInterval(interval);
                iframe.focus();
                iframe.contentWindow.print();
                iframe.parentNode.removeChild(iframe) ; // remove frame
                window.focus();
            }
        }, 100);
    }

    onSubmit() {
        this.loading(true);
        const endorsement = new CommonModel(this.formGroup.value);
        if (endorsement.document) {
            endorsement.document.type = AppUtils.getKey(DocumentType, 'Endorsement');
        }
        if (endorsement.id) {
            this.adminService.updateEndorsement(this.user.id, endorsement).subscribe(result => {
                this.loading(false);
                Object.assign(this.selectedBean, result);
                this.formGroup.patchValue(result);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.adminService.addEndorsement(this.user.id, endorsement).subscribe(result => {
                this.loading(false);
                this.result.data.push(result);
                this.formGroup.patchValue(result);
                this.selectedBean = result;
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex));
        }
    }

    doDelete(): void {
        this.loading(true);
        this.adminService.deleteEndorsement(this.user.id, this.selectedBean.id).subscribe(_  => {
            this.loading(false);
            this.result.data.forEach((item, idx) => {
                if (this.selectedBean && item.id === this.selectedBean.id) {
                    this.result.data.splice(idx, 1);
                    super.onReset();
                    this.success(Locales.recordDeleted);
                    return false;
                }
            });
        }, (ex) => this.errorHandler(ex));
    }

    resetBean() {
       return { notes: new Note() };
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, UserTabBaseModule],
    exports: [EndorsementTabComponent],
    declarations: [EndorsementTabComponent]
})
export class EndorsementTabModule {
}
