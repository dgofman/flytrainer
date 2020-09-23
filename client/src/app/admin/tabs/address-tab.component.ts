import Locales from '@locales/admin';
import { Component, NgModule, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Address } from 'src/modules/models/address';
import { AdminService } from 'src/services/admin.service';
import { AutoComplete } from 'primeng/autocomplete';
import { Country, State, AddressType } from 'src/modules/models/constants';
import { TabBaseDirective, TabBaseModule } from './tabbase.component';
import { ConfirmationService } from 'primeng/api';
import { Note } from 'src/modules/models/base.model';
import { AppUtils } from 'src/app/utils/app-utils';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';

@Component({
    selector: 'address-tab',
    templateUrl: './address-tab.component.html'
})
export class AddressTabComponent extends TabBaseDirective implements OnInit {
    addresses: Address[];
    currentAddress: Address;

    @ViewChild('desc') description: AutoComplete;

    constructor(confirmationService: ConfirmationService, private adminService: AdminService, private formBuilder: FormBuilder) {
        super(confirmationService);
        this.addresses = [];
        this.controls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'description' },
            { field: 'document' },
            { field: 'notes' },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], placeholder: Locales.selAccountType, value: Object.keys(AddressType).map(value => ({ label: AddressType[value], value })) },
            { field: 'other' },
            { field: 'pobox' },
            { field: 'street', header: Locales.street, type: 'input', validators: [Validators.required] },
            { field: 'city', header: Locales.city, type: 'input', validators: [Validators.required] },
            { field: 'state', header: Locales.state, type: 'auto', validators: [Validators.required], value: State },
            { field: 'code', header: Locales.code, type: 'mask', validators: [Validators.required], value: '99999', placeholder: 'ex. 95134' },
            { field: 'country', header: Locales.country, type: 'auto', validators: [Validators.required], value: Country },
            { field: 'phone', header: Locales.phone, type: 'input' },
            { field: 'fax', header: Locales.fax, type: 'input' },
            { field: 'isPrimary', header: Locales.isPrimary, type: 'switch' },
        ];
        const controls = { id: new FormControl(), notes: null };
        this.controls.forEach(c => {
            controls[c.field] = new FormControl(null, c.validators);
        });
        controls.notes = this.formBuilder.group({
            id: [''], content: ['']
        });
        this.formGroup = new FormGroup(controls);
    }

    ngOnInit() {
        this.loading(true);
        this.adminService.getAddress(this.user.id).subscribe(result => {
            this.loading(false);
            this.addresses = result;
            this.updateAddressList();
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
        const address = selectedIndex !== -1 ? this.addresses[selectedIndex] : this.onReset();
        if (!address.notes || AppUtils.isBlank(address.notes.content)) {
            address.notes = new Note({id: null, content: null});
        }
        this.selectedAddress = address;
        this.formGroup.patchValue(address);
    }

    get selectedAddress() {
        return this.currentAddress;
    }
    set selectedAddress(address: Address) {
        this.currentAddress = address;
        this.formGroup.patchValue(address);
    }

    findAddress(id: number) {
        return this.addresses.filter(e => e.id === id)[0];
    }

    filterAddress(event: any, ac: AutoComplete) {
        ac.suggestions = this.addresses.filter(e => e.description.toLowerCase().indexOf(event.query.toLowerCase()) === 0);
    }

    onSubmit() {
        const address = new Address(this.formGroup.value as any);
        if (AppUtils.isBlank(this.description.inputEL.nativeElement.value)) {
            this.description.inputEL.nativeElement.value = address.type;
        }
        address.description = this.description.inputEL.nativeElement.value;
        this.loading(true);
        if (address.id) {
            this.adminService.updateAddress(this.user.id, address).subscribe(result => {
                this.loading(false);
                this.updateAddressList(result);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.adminService.addAddress(this.user.id, address).subscribe(result => {
                this.loading(false);
                this.addresses.push(result);
                this.updateAddressList();
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex));
        }
    }

    doDelete() {
        this.loading(true);
        this.adminService.deleteAddress(this.user.id, this.selectedAddress.id).subscribe(_ => {
            this.loading(false);
            this.addresses.forEach((item, idx) => {
                if (item.id === this.selectedAddress.id) {
                    this.addresses.splice(idx, 1);
                    this.updateAddressList();
                    this.success(Locales.recordDeleted);
                    return false;
                }
            });
            this.updateAddressList();
        }, (ex) => this.errorHandler(ex));
    }

    onReset() {
        const address = new Address({ isPrimary: !this.addresses.length ? 1 : 0, state: this.environment.homeState, country: this.environment.homeCountry, notes: new Note() });
        this.currentAddress = null;
        this.formGroup.reset();
        this.formGroup.patchValue(address);
        return address;
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, TabBaseModule],
    exports: [AddressTabComponent],
    declarations: [AddressTabComponent]
})
export class AddressTabsModule {
}
