import Locales from '@locales/admin';
import { Component, NgModule } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { CommonModel, Note } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { Country, State, AddressType, ColumnType } from 'src/modules/models/constants';
import { TabBaseDirective, TabBaseModule } from './tabbase.component';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';
import { TableResult } from 'src/modules/models/table.result';
import { AppUtils } from 'src/app/utils/app-utils';

@Component({
    selector: 'contact-tab',
    templateUrl: './contact-tab.component.html',
    styles: [
        `p.row {
            cursor: pointer;
            font-weight: bold;
        }
        `
    ]
})
export class ContactTabComponent extends TabBaseDirective {
    result: TableResult<CommonModel>;
    addressControls: ColumnType[];
    showAddress: boolean;

    constructor(confirmationService: ConfirmationService, private adminService: AdminService, private formBuilder: FormBuilder) {
        super(confirmationService);
        this.controls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'document' },
            { field: 'description', header: Locales.description, type: 'input' },
            { field: 'first', header: Locales.firstname, type: 'input', validators: [Validators.required] },
            { field: 'middle', header: Locales.middlename, type: 'input' },
            { field: 'last', header: Locales.lastname, type: 'input', validators: [Validators.required] },
            { field: 'relationship', header: Locales.relationship, type: 'input', validators: [Validators.required] },
            { field: 'phone', header: Locales.phone, type: 'input' }
        ];
        this.addressControls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'type' },
            { field: 'other' },
            { field: 'pobox' },
            { field: 'street', header: Locales.street, type: 'input', validators: [Validators.required] },
            { field: 'city', header: Locales.city, type: 'input', validators: [Validators.required] },
            { field: 'code', header: Locales.code, type: 'input', validators: [Validators.required], placeholder: 'ex. 95134' },
            { field: 'state', header: Locales.state, type: 'auto', validators: [Validators.required], value: State, class: 'inlineL' },
            { field: 'country', header: Locales.country, type: 'auto', validators: [Validators.required], value: Country, class: 'inlineR' },
            { field: 'phone', header: Locales.phone, type: 'input', class: 'inlineL' },
            { field: 'fax', header: Locales.fax, type: 'input', class: 'inlineR' }
        ];
        const fields = {};
        this.addressControls.forEach(c => {
            fields[c.field] = [null, c.validators];
        });
        const controls = {
            notes: this.formBuilder.group({
                id: [null], content: [null]
            }),
            address: this.formBuilder.group(fields)
        };
        this.controls.forEach(c => {
            controls[c.field] = new FormControl(null, c.validators);
        });
        this.formGroup = new FormGroup(controls);
        this.formGroup.controls.address.disable();
        this.onReset();
    }

    updateSelectedBean(bean: any) {
        super.updateSelectedBean(bean);
        if (bean != null) {
            this.loading(true);
            this.adminService.getContact(this.user.id, bean.id).subscribe(e => {
                this.loading(false);
                this.onReset();
                this.formGroup.patchValue(e);
                this.includeAddress(e.address && e.address.id !== null, this.formGroup.controls);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.onReset();
        }
    }

    includeAddress(state: boolean, controls: any) {
        this.showAddress = state;
        if (state) {
            controls.address.enable();
        } else {
            controls.address.disable();
        }
    }

    lazyLoad(event?: LazyLoadEvent) {
        this.loading(true);
        this.adminService.getContacts(this.user.id, event.first).subscribe(result => {
            this.loading(false);
            this.result = result;
        }, (ex) => this.errorHandler(ex));
    }

    onSubmit() {
        const contact = new CommonModel(this.formGroup.value);
        this.loading(true);
        if (contact.id) {
            this.adminService.updateContact(this.user.id, contact).subscribe(result => {
                this.loading(false);
                Object.assign(this.selectedBean, result);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            contact.address.description = 'ContactHome';
            contact.address.type = AppUtils.getKey(AddressType, 'Home');
            contact.address.isPrimary = 0;
            this.adminService.addContact(this.user.id, contact).subscribe(result => {
                this.loading(false);
                this.result.data.push(result);
                this.formGroup.patchValue(result);
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex));
        }
    }

    doDelete(): void {
        this.loading(true);
        this.adminService.deleteContact(this.user.id, this.selectedBean.id).subscribe(_  => {
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

    onReset() {
        this.formGroup.reset();
        this.formGroup.patchValue({notes: new Note(), address: {state: this.environment.homeState, country: this.environment.homeCountry} });
        this.showAddress = false;
        this._selectedBean = null;
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, TabBaseModule],
    exports: [ContactTabComponent],
    declarations: [ContactTabComponent]
})
export class ContactTabModule {
}
