import Locales from '@locales/admin';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModel, Note } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { AircraftCategoryClass, DocumentType, CertificateType } from 'src/modules/models/constants';
import { UserTabBaseDirective, UserTabBaseModule } from '../user.component';
import { ConfirmationService } from 'primeng/api';
import { AppUtils } from 'src/app/utils/app-utils';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';
import { AutoComplete } from 'primeng/autocomplete/public_api';

@Component({
    selector: 'course-tab',
    templateUrl: './course-tab.component.html'
})
export class CourseTabComponent extends UserTabBaseDirective implements OnInit {
    cources: CommonModel[];
    aircraftCategory = AircraftCategoryClass;

    @ViewChild('desc') description: AutoComplete;

    constructor(confirmationService: ConfirmationService, private adminService: AdminService, private formBuilder: FormBuilder) {
        super(confirmationService);
        this.cources = [];
        this.controls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'document' },
            { field: 'description' },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(CertificateType).map(key => ({ label: CertificateType[key], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'number', header: Locales.certificate_num, type: 'input', validators: [Validators.required] },
            { field: 'limitations', header: Locales.limitations, type: 'input' },
            { field: 'issuedDate', header: Locales.issuedDate, type: 'cal', class: 'inlineL' },
            { field: 'expDate', header: Locales.expDate, type: 'cal', class: 'inlineR' },
            { field: 'renewDate', header: Locales.renewDate, type: 'cal', class: 'inlineL' },
            { field: 'currentBy', header: Locales.currentBy, type: 'cal', class: 'inlineR' },
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
    }

    ngOnInit() {
        this.loading(true);
        this.adminService.getCertificate(this.user.id).subscribe(result => {
            this.loading(false);
            this.cources = result;
            this.selectedBean = this.updateCertificateList();
        }, (ex) => this.errorHandler(ex));
    }

    updateCertificateList(update?: CommonModel) {
        let selectedIndex = -1;
        if (this.cources.length) {
            selectedIndex = 0;
            this.cources.forEach((item, idx) => {
                if (update) {
                    if (update.id === item.id) {
                        this.cources[idx] = update;
                    }
                }
            });
        }
        return selectedIndex !== -1 ? this.cources[selectedIndex] : this.onReset();
    }

    filterDescription(event: any, ac: AutoComplete) {
        ac.suggestions = this.cources.filter(e => e.description.toLowerCase().indexOf(event.query.toLowerCase()) === 0);
    }

    onSubmit() {
        this.loading(true);
        const certificate = new CommonModel(this.formGroup.value);
        if (certificate.document) {
            certificate.document.type = AppUtils.getKey(DocumentType, 'PilotCertificate');
        }
        if (certificate.id) {
            certificate.description = this.description.inputEL.nativeElement.value;
            this.adminService.updateCertificate(this.user.id, certificate).subscribe(result => {
                this.loading(false);
                this.updateCertificateList(result);
                this.selectedBean = result;
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            if (AppUtils.isBlank(this.description.inputEL.nativeElement.value)) {
                this.description.inputEL.nativeElement.value = certificate.type;
            }
            certificate.description = this.description.inputEL.nativeElement.value;
            this.adminService.addCertificate(this.user.id, certificate).subscribe(result => {
                this.loading(false);
                this.cources.push(result);
                this.selectedBean = this.updateCertificateList();
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex));
        }
    }

    doDelete() {
        this.loading(true);
        this.adminService.deleteCertificate(this.user.id, this.selectedBean.id).subscribe(_ => {
            this.loading(false);
            this.cources.forEach((item, idx) => {
                if (item.id === this.selectedBean.id) {
                    this.cources.splice(idx, 1);
                    this.selectedBean = this.updateCertificateList();
                    this.success(Locales.recordDeleted);
                    return false;
                }
            });
            this.updateCertificateList();
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
    exports: [CourseTabComponent],
    declarations: [CourseTabComponent]
})
export class CourseTabModule {
}
