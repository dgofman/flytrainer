import Locales from '@locales/admin';
import { Component, NgModule } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AdminService } from 'src/services/admin.service';
import { Country, State, AddressType, DocumentType } from 'src/modules/models/constants';
import { UserTabBaseDirective, UserTabBaseModule } from '../user.component';
import { ConfirmationService } from 'primeng/api';
import { Address, Note } from 'src/modules/models/base.model';
import { AppUtils } from 'src/app/utils/app-utils';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';

@Component({
    selector: 'address-tab',
    templateUrl: './address-tab.component.html'
})
export class AddressTabComponent extends UserTabBaseDirective {
    addresses: Address[];

    constructor(confirmationService: ConfirmationService, formBuilder: FormBuilder, private adminService: AdminService) {
        super(confirmationService, formBuilder);
        this.addresses = [];
        this.controls = [
            { field: 'document' },
            { field: 'description', header: Locales.description, type: 'input', maxlen: 30 },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(AddressType).map(key => ({ label: AddressType[key], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'pobox', type: 'hide', template: 'pobox' },
            { field: 'street', header: Locales.street, type: 'input', maxlen: 120, validators: [Validators.required] },
            { field: 'city', header: Locales.city, type: 'input', maxlen: 50, validators: [Validators.required], class: 'inlineL' },
            { field: 'code', header: Locales.code, type: 'input', maxlen: 16, validators: [Validators.required], placeholder: 'ex. 95134', class: 'inlineR' },
            { field: 'state', header: Locales.state, type: 'auto', validators: [Validators.required], value: State, class: 'inlineL' },
            { field: 'country', header: Locales.country, type: 'auto', validators: [Validators.required], value: Country, class: 'inlineR' },
            { field: 'phone', header: Locales.phone, type: 'phone', class: 'inlineL' },
            { field: 'fax', header: Locales.fax, type: 'phone', class: 'inlineR' },
            { field: 'isPrimary', header: Locales.isPrimary, type: 'switch' }
        ];
        this.initFormGroup();
    }

    lazyLoad() {
        this.loading(true);
        this.subs.add(this.adminService.getAddress(this.user.id).subscribe(result => {
            this.loading(false);
            this.addresses = result;
        }, (ex) => this.errorHandler(ex)));
    }

    onSubmit() {
        this.loading(true);
        const address = new Address(this.formGroup.value as any);
        if (address.id) {
            this.subs.add(this.adminService.updateAddress(this.user.id, address).subscribe(result => {
                this.loading(false);
                Object.assign(this.selectedBean, result);
                this.formGroup.patchValue(result);
                if (result.isPrimary) {
                    this.addresses.forEach((item, idx) => {
                        if (result.id === item.id) {
                            this.addresses[idx] = result;
                        } else if (result.isPrimary) {
                            item.isPrimary = 0;
                        }
                    });
                }
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex)));
        } else {
            if (address.document) {
                address.document.type = AppUtils.getKey(DocumentType, 'AddressProof');
            }
            this.subs.add(this.adminService.addAddress(this.user.id, address).subscribe(result => {
                this.loading(false);
                this.addresses.push(result);
                this.selectedBean = result;
                this.formGroup.patchValue(result);
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex)));
        }
    }

    doDelete() {
        this.loading(true);
        this.subs.add(this.adminService.deleteAddress(this.user.id, this.selectedBean.id).subscribe(_ => {
            this.loading(false);
            this.addresses.forEach((item, idx) => {
                if (item.id === this.selectedBean.id) {
                    this.addresses.splice(idx, 1);
                    this.onReset();
                    this.success(Locales.recordDeleted);
                    return false;
                }
            });
        }, (ex) => this.errorHandler(ex)));
    }

    resetBean() {
        return { type: AppUtils.getKey(AddressType, 'Home'), isPrimary: !this.addresses.length ? 1 : 0, state: this.environment.homeState, country: this.environment.homeCountry, notes: new Note() };
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, UserTabBaseModule],
    exports: [AddressTabComponent],
    declarations: [AddressTabComponent]
})
export class AddressTabModule {
}
