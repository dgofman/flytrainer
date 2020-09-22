import Locales from '@locales/admin';
import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Address } from 'src/modules/models/address';
import { AdminService } from 'src/services/admin.service';
import { AutoCompleteModule, AutoComplete } from 'primeng/autocomplete';
import { Country, State, AddressType } from 'src/modules/models/constants';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { FTAutoCompleteModule } from 'src/app/component/ft-autocomplete/ft-autocomplete.component';
import { TabBaseDirective } from './tabbase.component';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'address-tab',
    templateUrl: './address-tab.component.html'
})
export class AddressTabComponent extends TabBaseDirective implements OnInit {
    addresses: Address[];
    currentAddress: Address;

    @ViewChild('desc') description: AutoComplete;

    constructor(confirmationService: ConfirmationService, private adminService: AdminService) {
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
            { field: 'isPrimary', header: Locales.isPrimary, type: 'switch' }
        ];
        const controls = { id: new FormControl() };
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
            this.updateAddressList();
        }, (ex) => this.errorHandler(ex));
    }

    updateAddressList(update?: Address) {
        let address = this.onReset();
        if (this.addresses.length) {
            address = this.addresses[0];
            this.addresses.forEach((item, idx) => {
                if (update) {
                    if (update.id === item.id) {
                        this.addresses[idx] = item = update;
                    } else if (update.isPrimary) {
                        item.isPrimary = 0;
                    }
                }
                if (item.isPrimary) {
                    address = item;
                }
            });
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

    // convenience getter for easy access to form fields
    get f() {
        return this.formGroup.controls;
    }

    onSubmit() {
        const address = new Address(this.formGroup.value as any);
        if (this.description.inputEL.nativeElement.value.split(' ').join() === '') {
            this.description.inputEL.nativeElement.value = address.type;
        }
        address.description = this.description.inputEL.nativeElement.value;
        this.loading(true);
        if (address.id) {
            this.adminService.updateAddress(this.session.id, address).subscribe(result => {
                this.loading(false);
                this.updateAddressList(result);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.adminService.addAddress(this.session.id, address).subscribe(result => {
                this.loading(false);
                this.addresses.push(result);
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex));
        }
    }

    doDelete() {
        this.loading(true);
        this.adminService.deleteAddress(this.session.id, this.selectedAddress.id).subscribe(_ => {
            this.loading(false);
            this.addresses.forEach((item, idx) => {
                if (item.id === this.selectedAddress.id) {
                    this.addresses.splice(idx, 1);
                    this.success(Locales.recordDeleted);
                    return false;
                }
            });
            this.updateAddressList();
        }, (ex) => this.errorHandler(ex));
    }

    onReset() {
        const address = new Address({ isPrimary: !this.addresses.length ? 1 : 0, state: this.environment.homeState, country: this.environment.homeCountry });
        this.currentAddress = null;
        this.formGroup.reset();
        this.formGroup.patchValue(address);
        return address;
    }
}

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, AutoCompleteModule, InputTextModule, DropdownModule, InputSwitchModule, ButtonModule, InputMaskModule, FTAutoCompleteModule],
    exports: [AddressTabComponent],
    declarations: [AddressTabComponent]
})
export class AddressTabsModule {
}
