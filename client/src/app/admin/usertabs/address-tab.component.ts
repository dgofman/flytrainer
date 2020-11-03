import Locales from '@locales/admin';
import { Component, NgModule, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AdminService } from 'src/services/admin.service';
import { AutoComplete } from 'primeng/autocomplete';
import { Country, State, AddressType, DocumentType } from 'src/modules/models/constants';
import { TabBaseDirective, TabBaseModule } from './tabbase.component';
import { ConfirmationService } from 'primeng/api';
import { Address, Note } from 'src/modules/models/base.model';
import { AppUtils } from 'src/app/utils/app-utils';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';

@Component({
    selector: 'address-tab',
    templateUrl: './address-tab.component.html'
})
export class AddressTabComponent extends TabBaseDirective implements OnInit {
    addresses: Address[];

    @ViewChild('desc') description: AutoComplete;

    constructor(confirmationService: ConfirmationService, private adminService: AdminService, private formBuilder: FormBuilder) {
        super(confirmationService);
        this.addresses = [];
        this.controls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'description' },
            { field: 'document' },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(AddressType).map(key => ({ label: AddressType[key], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'pobox', type: 'hide', template: 'pobox' },
            { field: 'street', header: Locales.street, type: 'input', validators: [Validators.required] },
            { field: 'city', header: Locales.city, type: 'input', validators: [Validators.required] },
            { field: 'code', header: Locales.code, type: 'input', validators: [Validators.required], placeholder: 'ex. 95134' },
            { field: 'state', header: Locales.state, type: 'auto', validators: [Validators.required], value: State, class: 'inlineL' },
            { field: 'country', header: Locales.country, type: 'auto', validators: [Validators.required], value: Country, class: 'inlineR' },
            { field: 'phone', header: Locales.phone, type: 'input', class: 'inlineL' },
            { field: 'fax', header: Locales.fax, type: 'input', class: 'inlineR' },
            { field: 'isPrimary', header: Locales.isPrimary, type: 'switch' }
        ];
        const controls = { notes: this.formBuilder.group({
            id: [null], content: [null]
        })};
        this.controls.forEach(c => {
            controls[c.field] = new FormControl(null, c.validators);
        });
        this.formGroup = new FormGroup(controls);
    }

    ngOnInit() {
        this.loading(true);
        this.adminService.getAddress(this.user.id).subscribe(result => {
            this.loading(false);
            this.addresses = result;
            this.selectedBean = this.updateAddressList();
        }, (ex) => this.errorHandler(ex));
    }

    updateAddressList(update?: Address) {
        let selectedIndex = -1;
        if (this.addresses.length) {
            selectedIndex = 0;
            this.addresses.forEach((item, idx) => {
                if (update) {
                    if (update.id === item.id) {
                        this.addresses[idx] = item = update;
                    } else if (update.isPrimary) {
                        item.isPrimary = 0;
                    }
                }
                if (item.isPrimary) {
                    selectedIndex = idx;
                }
            });
        }
        return selectedIndex !== -1 ? this.addresses[selectedIndex] : this.onReset();
    }

    filterDescription(event: any, ac: AutoComplete) {
        ac.suggestions = this.addresses.filter(e => (e.description || '').toLowerCase().indexOf(event.query.toLowerCase()) === 0);
    }

    onSubmit() {
        this.loading(true);
        const address = new Address(this.formGroup.value as any);
        if (address.id) {
            address.description = this.description.inputEL.nativeElement.value;
            this.adminService.updateAddress(this.user.id, address).subscribe(result => {
                this.loading(false);
                this.selectedBean = this.updateAddressList(result);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            if (AppUtils.isBlank(this.description.inputEL.nativeElement.value)) {
                this.description.inputEL.nativeElement.value = address.type + ' Address';
            }
            address.description = this.description.inputEL.nativeElement.value;
            if (address.document) {
                address.document.type = AppUtils.getKey(DocumentType, 'AddressProof');
            }
            this.adminService.addAddress(this.user.id, address).subscribe(result => {
                this.loading(false);
                this.addresses.push(result);
                this.selectedBean = this.updateAddressList();
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex));
        }
    }

    doDelete() {
        this.loading(true);
        this.adminService.deleteAddress(this.user.id, this.selectedBean.id).subscribe(_ => {
            this.loading(false);
            this.addresses.forEach((item, idx) => {
                if (item.id === this.selectedBean.id) {
                    this.addresses.splice(idx, 1);
                    this.selectedBean = this.updateAddressList();
                    this.success(Locales.recordDeleted);
                    return false;
                }
            });
            this.updateAddressList();
        }, (ex) => this.errorHandler(ex));
    }

    onReset() {
        super.onReset();
        const address = new Address({ type: AppUtils.getKey(AddressType, 'Home'), isPrimary: !this.addresses.length ? 1 : 0, state: this.environment.homeState, country: this.environment.homeCountry, notes: new Note() });
        this.formGroup.patchValue(address);
        return address;
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, TabBaseModule],
    exports: [AddressTabComponent],
    declarations: [AddressTabComponent]
})
export class AddressTabModule {
}