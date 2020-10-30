import Locales from '@locales/admin';
import { Component, NgModule } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { CommonModel, Note } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { AccountType } from 'src/modules/models/constants';
import { TabBaseDirective, TabBaseModule } from './tabbase.component';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';
import { TableResult } from 'src/modules/models/table.result';

@Component({
    selector: 'account-tab',
    templateUrl: './account-tab.component.html'
})
export class AccountTabComponent extends TabBaseDirective {
    result: TableResult<CommonModel>;

    constructor(confirmationService: ConfirmationService, private adminService: AdminService, private formBuilder: FormBuilder) {
        super(confirmationService);
        this.controls = [
            { field: 'id' },
            { field: 'version' },
            { field: 'document' },
            { field: 'description', header: Locales.description, type: 'input' },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(AccountType).map(key => ({ label: AccountType[key], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'accountId', header: Locales.accountNumber, type: 'input', placeholder: Locales.leaveBlankAutoGet },
            { field: 'middle', header: Locales.middlename, type: 'input' },
            { field: 'expDate', header: Locales.expDate, type: 'cal'},
            { field: 'autoPayment', header: Locales.autoPayment, type: 'popup' },
            { field: 'defaultTier', header: Locales.defaultTier, type: 'popup' },
            { field: 'isActive', header: Locales.isActive, type: 'check' }
        ];

        const controls = {
            notes: this.formBuilder.group({
                id: [null], content: [null]
            })
        };
        this.controls.forEach(c => {
            controls[c.field] = new FormControl(null, c.validators);
        });
        this.formGroup = new FormGroup(controls);
        this.onReset();
    }

    updateSelectedBean(bean: any) {
        super.updateSelectedBean(bean);
        if (bean != null) {
            this.loading(true);
            this.adminService.getAccount(this.user.id, bean.id).subscribe(e => {
                this.loading(false);
                this.formGroup.patchValue(Object.assign(this.defaultBean, e))   ;
            }, (ex) => this.errorHandler(ex));
        } else {
            this.onReset();
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
        const account = new CommonModel(this.formGroup.value);
        this.loading(true);
        if (account.id) {
            this.adminService.updateAccount(this.user.id, account).subscribe(result => {
                this.loading(false);
                Object.assign(this.selectedBean, result);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.adminService.addAccount(this.user.id, account).subscribe(result => {
                this.loading(false);
                this.result.data.push(result);
                this.formGroup.patchValue(result);
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex));
        }
    }

    doDelete(): void {
        this.loading(true);
        this.adminService.deleteAccount(this.user.id, this.selectedBean.id).subscribe(_  => {
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
        this.formGroup.patchValue(this.defaultBean);
        this._selectedBean = null;
    }

    get defaultBean() {
       return { type: this.AppUtils.getKey(AccountType, 'Pilot'), notes: new Note() };
    }
}


@NgModule({
    imports: [CommonModule, AdminSharedModule, TabBaseModule],
    exports: [AccountTabComponent],
    declarations: [AccountTabComponent]
})
export class AccountTabModule {
}
