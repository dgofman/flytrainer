import Locales from '@locales/admin';
import { CommonModule } from '@angular/common';
import { Component, NgModule, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { AppBaseDirective } from 'src/app/app.base.component';
import { ColumnType } from 'src/app/component/ft-table/ft-table.component';
import { Address } from 'src/modules/models/address';
import { AdminService } from 'src/services/admin.service';
import { AutoCompleteModule, AutoComplete } from 'primeng/autocomplete';
import { Country, State, AddressType } from 'src/modules/models/constants';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { FTAutoCompleteModule } from 'src/app/component/ft-autocomplete/ft-autocomplete.component';
import { User } from 'src/modules/models/user';


@Component({
    selector: 'address-tab',
    templateUrl: './address-tab.component.html'
})
export class AddressTabComponent extends AppBaseDirective implements OnInit {
    Locales = Locales;
    registerForm: FormGroup;
    controls: ColumnType[];
    addresses: Address[];
    currentAddress: Address;

    @Input() user: User;
    @ViewChild('desc') description: AutoComplete;

    constructor(private adminService: AdminService) {
        super();
        this.addresses = [];
        this.controls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'description' },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], placeholder: Locales.selAccountType, value: Object.keys(AddressType).map(value => ({ label: AddressType[value], value }) ) },
            { field: 'street', header: Locales.street, type: 'input', validators: [Validators.required] },
            { field: 'city', header: Locales.city, type: 'input', validators: [Validators.required] },
            { field: 'state', header: Locales.state, type: 'auto', validators: [Validators.required], value: State },
            { field: 'code', header: Locales.zipCode, type: 'mask', validators: [Validators.required], value: '99999', placeholder: 'ex. 95134' },
            { field: 'country', header: Locales.country, type: 'auto', validators: [Validators.required], value: Country },
            { field: 'isPrimary', header: Locales.isPrimary, type: 'switch' }
        ];
        const controls = { id: new FormControl() };
        this.controls.forEach(c => {
            controls[c.field] = new FormControl(null, c.validators);
        });
        this.registerForm = new FormGroup(controls);
        this.registerForm.patchValue({isPrimary: true});
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
        let address = new Address();
        address.isPrimary = !this.addresses.length ? 1 : 0;
        if (this.addresses.length) {
            address = this.addresses[0];
            this.addresses.forEach((item, idx)  => {
                if (update && update.id === item.id) {
                    this.addresses[idx] = item = update;
                }
                if (item.isPrimary) {
                    address = item;
                }
            });
        }
        this.selectedAddress = address;
        this.registerForm.patchValue(address);
    }

    get selectedAddress() {
        return this.currentAddress;
    }
    set selectedAddress(address: Address) {
        this.currentAddress = address;
        this.registerForm.patchValue(address);
    }

    findAddress(id: number) {
        return this.addresses.filter(e => e.id === id)[0];
    }

    filterAddress(event: any, ac: AutoComplete) {
        ac.suggestions = this.addresses.filter(e => e.description.toLowerCase().indexOf(event.query.toLowerCase()) === 0);
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.registerForm.controls;
    }

    onSubmit() {
        const address = new Address(this.registerForm.value as any);
        if (this.description.inputEL.nativeElement.value.split(' ').join() === '') {
            this.description.inputEL.nativeElement.value = address.type;
        }
        address.description = this.description.inputEL.nativeElement.value;
        this.loading(true);
        if (address.id) {
            this.adminService.updateAddress(this.session.id, address).subscribe(result => {
                this.loading(false);
                this.updateAddressList(result);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.adminService.addAddress(this.session.id, address).subscribe(result => {
                this.loading(false);
                this.addresses.push(result);
            }, (ex) => this.errorHandler(ex));
        }
    }

    onDelete() {
        this.loading(true);
        this.adminService.deleteAddress(this.session.id, this.selectedAddress.id).subscribe(_ => {
            this.loading(false);
            this.addresses.forEach((item, idx) => {
                if (item.id === this.selectedAddress.id) {
                    this.addresses.splice(idx, 1);
                    return false;
                }
            });
            this.updateAddressList();
        }, (ex) => this.errorHandler(ex));
    }

    onReset() {
        this.currentAddress = null;
        this.registerForm.reset();
    }
}

@NgModule({
    imports: [ CommonModule, FormsModule, ReactiveFormsModule, AutoCompleteModule, InputTextModule, DropdownModule, InputSwitchModule, ButtonModule, InputMaskModule, FTAutoCompleteModule ],
    exports: [ AddressTabComponent ],
    declarations: [ AddressTabComponent ]
})
export class AddressTabsModule {
}
