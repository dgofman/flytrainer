import Locales from '@locales/admin';
import { Component, NgModule, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { CommonModel, User, Note, Address } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { Country, State, AddressType, Role, ColumnType, DocumentType } from 'src/modules/models/constants';
import { UserTabBaseDirective, UserTabBaseModule } from '../user.component';
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
export class UserTabComponent extends UserTabBaseDirective implements OnInit {

    accounts: CommonModel[];
    addressControls: ColumnType[];
    isAddress: boolean;

    constructor(confirmationService: ConfirmationService, formBuilder: FormBuilder, private adminService: AdminService, private eventService: EventService) {
        super(confirmationService, formBuilder);
        this.controls = [
            { field: 'document' },
            { field: 'username', header: Locales.username, type: 'input', maxlen: 50, validators: [Validators.required], class: 'inlineL' },
            { field: 'email', header: Locales.email, type: 'input', maxlen: 100, validators: [Validators.required, Validators.email], class: 'inlineR' },
            { field: 'first', header: Locales.firstname, type: 'input', maxlen: 50, validators: [Validators.required], class: 'inlineL' },
            { field: 'last', header: Locales.lastname, type: 'input', maxlen: 50, validators: [Validators.required], class: 'inlineR' },
            { field: 'middle', header: Locales.middlename, type: 'input', maxlen: 50, class: 'inlineL' },
            { field: 'sex', header: Locales.sex, type: 'radio', maxlen: 50, value: [Locales.male, Locales.female, 'M', 'F'], class: 'inlineR' },
            { field: 'role', header: Locales.role, type: 'popup', value: Object.keys(Role).map(key => ({ label: Role[key], value: key })), class: 'inlineL' },
            { field: 'ssn' , header: Locales.ssn, type: 'mask', maxlen: 10, value: '999-99-9999', class: 'inlineR' },
            { field: 'phone', header: Locales.phone, type: 'phone', class: 'inlineL' },
            { field: 'ftn', header: Locales.ftn, type: 'input', maxlen: 10, class: 'inlineR' },
            { field: 'dl', header: Locales.driverLicense, type: 'input', maxlen: 10, class: 'inlineL' },
            { field: 'dlState', header: Locales.driverState, type: 'auto', value: State, class: 'inlineR' },
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
        this.formGroup.controls.address.disable();
    }

    ngOnInit(): void {
        if (this.user && this.user.id) {
            this.loading(true);
            this.adminService.getUser(this.user.id).subscribe(result => {
                this.loading(false);
                this.selectedBean = Object.assign(this.defaultBean, result);
                Object.assign(this.user, this.selectedBean);
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
                Object.assign(this.user, result);
                this.formGroup.patchValue(result);
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
    imports: [CommonModule, AdminSharedModule, UserTabBaseModule],
    exports: [UserTabComponent],
    declarations: [UserTabComponent]
})
export class UserTabModule {
}
