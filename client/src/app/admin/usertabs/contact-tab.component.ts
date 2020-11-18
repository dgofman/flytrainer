import Locales from '@locales/admin';
import { Component, NgModule } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Contact, Note, Address } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { Country, State, AddressType, ColumnType } from 'src/modules/models/constants';
import { UserTabBaseDirective, UserTabBaseModule } from '../user.component';
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
export class ContactTabComponent extends UserTabBaseDirective {
    result: TableResult<Contact>;
    addressControls: ColumnType[];
    isAddress: boolean;

    constructor(confirmationService: ConfirmationService, formBuilder: FormBuilder, private adminService: AdminService) {
        super(confirmationService, formBuilder);
        this.controls = [
            { field: 'description', header: Locales.description, type: 'input', maxlen: 30 },
            { field: 'first', header: Locales.firstname, type: 'input', maxlen: 50, validators: [Validators.required] },
            { field: 'middle', header: Locales.middlename, type: 'input', maxlen: 50 },
            { field: 'last', header: Locales.lastname, type: 'input', maxlen: 50, validators: [Validators.required] },
            { field: 'relationship', header: Locales.relationship, type: 'input', maxlen: 30, validators: [Validators.required] },
            { field: 'phone', header: Locales.phone, type: 'phone' }
        ];
        this.addressControls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(AddressType).map(key => ({ label: AddressType[key], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'pobox', type: 'hide', template: 'pobox' },
            { field: 'street', header: Locales.street, type: 'input', maxlen: 120, validators: [Validators.required] },
            { field: 'city', header: Locales.city, type: 'input', maxlen: 50, validators: [Validators.required] },
            { field: 'code', header: Locales.code, type: 'input', maxlen: 16, validators: [Validators.required], placeholder: 'ex. 95134' },
            { field: 'state', header: Locales.state, type: 'auto', validators: [Validators.required], value: State, class: 'inlineL' },
            { field: 'country', header: Locales.country, type: 'auto', validators: [Validators.required], value: Country, class: 'inlineR' },
            { field: 'phone', header: Locales.phone, type: 'phone', class: 'inlineL' },
            { field: 'fax', header: Locales.fax, type: 'phone', class: 'inlineR' }
        ];
        const fields = {};
        this.addressControls.forEach(c => {
            fields[c.field] = [null, c.validators];
        });
        this.initFormGroup({address: this.formBuilder.group(fields)});
    }

    updateSelectedBean(bean: any) {
        super.updateSelectedBean(bean);
        if (bean != null) {
            this.showAddress(bean.address && bean.address.id !== null, this.formGroup.controls);
        }
    }

    showAddress(state: boolean, controls: any) {
        this.isAddress = state;
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
        const contact = new Contact(this.formGroup.value),
            address = contact.address;
        this.loading(true);
        if (address && !address.id) {
            address.description = contact.relationship +  `, Contact Address`;
            address.isPrimary = 0;
        }
        if (contact.id) {
            this.adminService.updateContact(this.user.id, contact).subscribe(result => {
                this.loading(false);
                Object.assign(this.selectedBean, result);
                this.formGroup.patchValue(result);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.adminService.addContact(this.user.id, contact).subscribe(result => {
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
        super.onReset();
        this.showAddress(false, this.formGroup.controls);
    }

    resetBean() {
       return { notes: new Note(), address: new Address({type: AppUtils.getKey(AddressType, 'Contact'), state: this.environment.homeState, country: this.environment.homeCountry}) };
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, UserTabBaseModule],
    exports: [ContactTabComponent],
    declarations: [ContactTabComponent]
})
export class ContactTabModule {
}
