import Locales from '@locales/admin';
import { Component, NgModule } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { CommonModel, Note } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { AccountType } from 'src/modules/models/constants';
import { UserTabBaseDirective, UserTabBaseModule } from '../user.component';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';
import { EventService, EventType } from 'src/services/event.service';

@Component({
    selector: 'account-tab',
    templateUrl: './account-tab.component.html'
})
export class AccountTabComponent extends UserTabBaseDirective {
    result: CommonModel[];

    constructor(confirmationService: ConfirmationService, formBuilder: FormBuilder, private adminService: AdminService, private eventService: EventService) {
        super(confirmationService, formBuilder);
        this.controls = [
            { field: 'description', header: Locales.description, type: 'input', maxlen: 30 },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(AccountType).map(key => ({ label: AccountType[key], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'accountId', header: Locales.accountNumber, type: 'input', placeholder: Locales.leaveBlankAutoGet },
            { field: 'expDate', header: Locales.expDate, type: 'cal'},
            { field: 'autoPayment', header: Locales.autoPayment, type: 'popup' },
            { field: 'defaultTier', header: Locales.defaultTier, type: 'popup' },
            { field: 'isActive', header: Locales.isActive, type: 'check' }
        ];
        this.initFormGroup();
    }

    lazyLoad() {
        this.loading(true);
        this.subs.add(this.adminService.getAccounts(this.user.id).subscribe(result => {
            this.loading(false);
            this.result = result;
        }, (ex) => this.errorHandler(ex)));
    }

    onSubmit() {
        const account = new CommonModel(this.formGroup.value);
        this.loading(true);
        if (account.id) {
            this.subs.add(this.adminService.updateAccount(this.user.id, account).subscribe(result => {
                this.loading(false);
                Object.assign(this.selectedBean, result);
                this.formGroup.patchValue(result);
                this.eventService.emit(EventType.Refresh, null);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex)));
        } else {
            this.subs.add(this.adminService.addAccount(this.user.id, account).subscribe(result => {
                this.loading(false);
                this.result.push(result);
                this.formGroup.patchValue(result);
                this.selectedBean = result;
                this.eventService.emit(EventType.Refresh, null);
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex)));
        }
    }

    doDelete(): void {
        this.loading(true);
        this.subs.add(this.adminService.deleteAccount(this.user.id, this.selectedBean.id).subscribe(_  => {
            this.loading(false);
            this.result.forEach((item, idx) => {
                if (this.selectedBean && item.id === this.selectedBean.id) {
                    this.result.splice(idx, 1);
                    super.onReset();
                    this.eventService.emit(EventType.Refresh, null);
                    this.success(Locales.recordDeleted);
                    return false;
                }
            });
        }, (ex) => this.errorHandler(ex)));
    }

    resetBean() {
       return { type: this.AppUtils.getKey(AccountType, 'Renter'), notes: new Note() };
    }
}


@NgModule({
    imports: [CommonModule, AdminSharedModule, UserTabBaseModule],
    exports: [AccountTabComponent],
    declarations: [AccountTabComponent]
})
export class AccountTabModule {
}
