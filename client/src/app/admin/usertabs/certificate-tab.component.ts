import Locales from '@locales/admin';
import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModel, Note } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { AircraftCategoryClass, DocumentType, CertificateType } from 'src/modules/models/constants';
import { UserTabBaseDirective, UserTabBaseModule } from '../user.component';
import { ConfirmationService } from 'primeng/api';
import { AppUtils } from 'src/app/utils/app-utils';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';

@Component({
    selector: 'certificate-tab',
    templateUrl: './certificate-tab.component.html'
})
export class CertificateTabComponent extends UserTabBaseDirective {
    certificates: CommonModel[];
    aircraftCategory = AircraftCategoryClass;

    constructor(confirmationService: ConfirmationService, private adminService: AdminService, private formBuilder: FormBuilder) {
        super(confirmationService);
        this.controls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'document' },
            { field: 'number' },
            { field: 'limitations' },
            { field: 'description' },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(CertificateType).map(key => ({ label: CertificateType[key], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'issuedDate', header: Locales.issuedDate, type: 'cal', class: 'inlineL' },
            { field: 'expDate', header: Locales.expDate, type: 'cal', class: 'inlineR' },
            { field: 'isSuspended' },
            { field: 'isWithdrawn' }
        ];
        const fields = {};
        Object.keys(AircraftCategoryClass).forEach(key => {
            fields[key] = [null];
        });
        const controls = {
            notes: this.formBuilder.group({
                id: [null], content: [null]
            }),
            aircraftClass: this.formBuilder.group(fields)
        };
        this.controls.forEach(c => {
            controls[c.field] = new FormControl(null, c.validators);
        });
        this.formGroup = new FormGroup(controls);
        this.onReset();
    }

    getType(key: string) {
        return CertificateType[key];
    }

    lazyLoad() {
        this.loading(true);
        this.adminService.getCertificate(this.user.id).subscribe(result => {
            this.loading(false);
            this.certificates = result;
        }, (ex) => this.errorHandler(ex));
    }

    onSubmit() {
        this.loading(true);
        const certificate = new CommonModel(this.formGroup.value);
        if (certificate.document) {
            certificate.document.type = AppUtils.getKey(DocumentType, 'PilotCertificate');
        }
        if (certificate.id) {
            this.adminService.updateCertificate(this.user.id, certificate).subscribe(result => {
                this.loading(false);
                Object.assign(this.selectedBean, result);
                this.formGroup.patchValue(result);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.adminService.addCertificate(this.user.id, certificate).subscribe(result => {
                this.loading(false);
                this.certificates.push(result);
                this.selectedBean = result;
                this.formGroup.patchValue(result);
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex));
        }
    }

    doDelete() {
        this.loading(true);
        this.adminService.deleteCertificate(this.user.id, this.selectedBean.id).subscribe(_ => {
            this.loading(false);
            this.certificates.forEach((item, idx) => {
                if (item.id === this.selectedBean.id) {
                    this.certificates.splice(idx, 1);
                    super.onReset();
                    this.success(Locales.recordDeleted);
                    return false;
                }
            });
        }, (ex) => this.errorHandler(ex));
    }

    onReset() {
        super.onReset();
        const certificate = new CommonModel({ type: AppUtils.getKey(CertificateType, 'PrivatePilot'), aircraftClass: {}, notes: new Note() });
        this.formGroup.patchValue(certificate);
        return certificate;
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, UserTabBaseModule],
    exports: [CertificateTabComponent],
    declarations: [CertificateTabComponent]
})
export class CertificateTabModule {
}
