import Locales from '@locales/admin';
import { CommonModule } from '@angular/common';
import { Component, NgModule, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { AppBaseDirective } from 'src/app/app.base.component';
import { ColumnType } from 'src/app/component/ft-table/ft-table.component';
import { Address } from 'src/modules/models/address';
import { AdminService } from 'src/services/admin.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
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

    @Input() user: User;

    constructor(private adminService: AdminService) {
        super();
        this.addresses = [];
        this.controls = [
            { field: 'description', header: Locales.description, type: 'input', validators: [Validators.required] },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], placeholder: Locales.selAccountType, value: Object.keys(AddressType).map(value => ({ label: AddressType[value], value }) ) },
            { field: 'street', header: Locales.street, type: 'input', validators: [Validators.required] },
            { field: 'city', header: Locales.city, type: 'input', validators: [Validators.required] },
            { field: 'state', header: Locales.state, type: 'auto', validators: [Validators.required], value: State },
            { field: 'code', header: Locales.zipCode, type: 'mask', validators: [Validators.required], value: '99999', placeholder: 'ex. 95134 ' },
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
            let model = new Address();
            model.isPrimary = !result.length ? 1 : 0;
            result.forEach(address => {
                model = address;
                if (address.isPrimary) {
                    return;
                }
            });
            this.registerForm.patchValue(model);
        }, (ex) => this.errorHandler(ex));
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.registerForm.controls;
    }

    onSubmit() {
        const address = new Address(this.registerForm.value as any);
        this.loading(true);
        if (address.id) {
            this.adminService.updateAddress(this.session.id, address).subscribe(_ => {
                this.loading(false);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.adminService.addAddress(this.session.id, address).subscribe(result => {
                this.loading(false);
                this.addresses.push(result);
            }, (ex) => this.errorHandler(ex));
        }
    }

    onDelete() {
        const address = new Address(this.registerForm.value as any);
        this.loading(true);
        this.adminService.deleteAddress(this.session.id, address.id).subscribe(_ => {
            this.loading(false);
            this.addresses.forEach((item, idx) => {
                if (item.id === address.id) {
                    this.addresses.splice(idx, 1);
                    return;
                }
            });
        }, (ex) => this.errorHandler(ex));
    }

    onReset() {
        this.registerForm.reset();
    }
}

@NgModule({
    imports: [ CommonModule, AutoCompleteModule, InputTextModule, DropdownModule, InputSwitchModule, ButtonModule, InputMaskModule, ReactiveFormsModule, FTAutoCompleteModule ],
    exports: [ AddressTabComponent ],
    declarations: [ AddressTabComponent ]
})
export class AddressTabsModule {
}
