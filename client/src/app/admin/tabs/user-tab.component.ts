import Locales from '@locales/admin';
import { Component, NgModule, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { CommonModel, User, Note, Address } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { Country, State, AddressType, Role, ColumnType, DocumentType } from 'src/modules/models/constants';
import { TabBaseDirective, TabBaseModule } from './tabbase.component';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';
import { AppUtils } from 'src/app/utils/app-utils';
import { EventType, EventService } from 'src/services/event.service';

@Component({
    selector: 'user-tab',
    templateUrl: './user-tab.component.html',
    styles: [
        `p.row {
            cursor: pointer;
            font-weight: bold;
        }
        `
    ]
})
export class UserTabComponent extends TabBaseDirective implements OnInit {

    accounts: CommonModel[];
    addressControls: ColumnType[];
    isAddress: boolean;

    constructor(confirmationService: ConfirmationService, private adminService: AdminService, private formBuilder: FormBuilder, private eventService: EventService) {
        super(confirmationService);
        this.controls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'document' },
            { field: 'username', header: Locales.username, type: 'input', validators: [Validators.required], class: 'inlineL' },
            { field: 'email', header: Locales.email, type: 'input', validators: [Validators.required], class: 'inlineR' },
            { field: 'first', header: Locales.firstname, type: 'input', validators: [Validators.required] },
            { field: 'middle', header: Locales.middlename, type: 'input' },
            { field: 'last', header: Locales.lastname, type: 'input', validators: [Validators.required] },
            { field: 'role', header: Locales.role, type: 'popup', value: Object.keys(Role).map(key => ({ label: Role[key], value: key })), class: 'inlineL' },
            { field: 'ssn' , header: Locales.ssn, type: 'input', class: 'inlineR' },
            { field: 'phone', header: Locales.phone, type: 'input', class: 'inlineL' },
            { field: 'ftn', header: Locales.ftn, type: 'input', class: 'inlineR' },
            { field: 'dl', header: Locales.driverLicense, type: 'input', class: 'inlineL' },
            { field: 'dlState', header: Locales.driverState, type: 'input', class: 'inlineR' },
            { field: 'dlExpDate', header: Locales.dlExpDate, type: 'cal', class: 'inlineL' },
            { field: 'birthday', header: Locales.birthday, type: 'cal', class: 'inlineR' },
            { field: 'isActive', header: Locales.isActive, type: 'check', class: 'inline gap' },
            { field: 'isCitizen', header: Locales.isCitizen, type: 'check', class: 'inline gap' },
            { field: 'isMemeber', header: Locales.isMemeber, type: 'check', class: 'inline gap' },
            { field: 'isSchoolEmployee', header: Locales.isSchoolEmployee, type: 'check', class: 'inline gap' },
            { field: 'englishProficient', header: Locales.englishProficient, type: 'check', class: 'inline gap' },
            { field: 'resetPassword', header: Locales.resetPassword, type: 'check', class: 'inline' }
        ];
        this.addressControls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(AddressType).map(key => ({ label: AddressType[key], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'pobox', type: 'hide', template: 'pobox' },
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

    ngOnInit(): void {
        if (this.user && this.user.id) {
            this.loading(true);
            this.adminService.getUser(this.user.id).subscribe(result => {
                this.loading(false);
                this.selectedBean = Object.assign(this.defaultBean, result);
                this.showAddress(result.address && result.address.id !== null, this.formGroup.controls);
            }, (ex) => this.errorHandler(ex));
        }
    }

    get isAdmin(): boolean {
        return AppUtils.canViewAdmin();
    }

    showAddress(state: boolean, controls: any) {
        this.isAddress = state;
        if (state) {
            controls.address.enable();
        } else {
            controls.address.disable();
        }
    }

    lazyLoad() {
        if (this.user && this.user.id) {
            this.loading(true);
            this.adminService.getAccounts(this.user.id).subscribe(result => {
                this.loading(false);
                this.accounts = result;
            }, (ex) => this.errorHandler(ex));
        }
    }

    onSubmit() {
        const user = new User(this.formGroup.value),
            address = user.address,
            document = user.document;
        this.loading(true);
        if (address && !address.id) {
            address.description = address.type + ' Address';
            address.isPrimary = 1;
        }
        if (document && !document.id) {
            document.type = AppUtils.getKey(DocumentType, 'PilotPicture');
        }
        if (user.id) {
            this.adminService.updateUser(this.user.id, user).subscribe(result => {
                this.loading(false);
                Object.assign(this.selectedBean, result);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.adminService.addUser(user).subscribe(result => {
                this.loading(false);
                this.selectedBean = result;
                this.eventService.emit(EventType.Refresh, result);
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex));
        }
    }

    showPassword() {
        this.loading(true);
        this.adminService.getPassword(this.user.id, this.user.username).subscribe(pwd => {
            this.loading(false);
            const dlg = this.confirmationService.confirm({
                key: 'confDialog',
                header: Locales.password,
                message: pwd,
                accept: () => {
                    dlg.close();
                }
            });
        }, (ex) => this.errorHandler(ex));
    }

    doDelete(): void {
        throw new Error('Cannot delete user from UI');
    }

    onReset() {
        super.onReset();
        this.formGroup.patchValue(this.defaultBean);
    }

    get defaultBean() {
       return { role: Role.USER, notes: new Note(), address: new Address({type: AppUtils.getKey(AddressType, 'Home'), state: this.environment.homeState, country: this.environment.homeCountry}) };
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, TabBaseModule],
    exports: [UserTabComponent],
    declarations: [UserTabComponent]
})
export class UserTabModule {
}
