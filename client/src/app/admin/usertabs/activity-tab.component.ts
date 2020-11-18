import Locales from '@locales/admin';
import { Component, NgModule } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModel, Note } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { UserTabBaseDirective, UserTabBaseModule } from '../user.component';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';
import { TableResult } from 'src/modules/models/table.result';
import { AircraftCategoryClass, CurrencyType, CourseType, FlightType, CancelationType, ColumnType } from 'src/modules/models/constants';
import { AppUtils } from 'src/app/utils/app-utils';

enum VIEW_FORM {
    Currency = 'Currency',
    Course = 'Course',
    Flight = 'Flight'
}

@Component({
    selector: 'activity-tab',
    templateUrl: './activity-tab.component.html'
})
export class ActivityTabComponent extends UserTabBaseDirective {
    enum = VIEW_FORM;
    activityTypes = Object.keys(VIEW_FORM).map(key => ({ label: VIEW_FORM[key], value: key }));
    aircraftCategory = AircraftCategoryClass;
    viweForm: VIEW_FORM;
    result: TableResult<CommonModel>;
    currencies: ColumnType[];
    courses: ColumnType[];
    flights: ColumnType[];
    availableCourses: any[];

    currencyGroup: FormGroup;
    courseGroup: FormGroup;
    flightGroup: FormGroup;

    constructor(confirmationService: ConfirmationService, formBuilder: FormBuilder, private adminService: AdminService) {
        super(confirmationService, formBuilder);
        this.viweForm = VIEW_FORM.Currency;
        this.availableCourses = [];
        this.currencies = [
            { field: 'document' },
            { field: 'description', header: Locales.description, type: 'input', maxlen: 30 },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(CurrencyType).map(key => ({ label: CurrencyType[key][0], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'issuedDate', header: Locales.issuedDate, type: 'cal', class: 'inlineL' },
            { field: 'expDate', header: Locales.expDate, type: 'cal', class: 'inlineR' },
            { field: 'isCanceled', header: Locales.isCanceled, type: 'switch', class: 'p-md-2' }
        ];
        this.courses = [
            { field: 'document' },
            { field: 'course', type: 'hide', template: 'course' },
            { field: 'type', header: Locales.type, type: 'input', class: 'disabled' },
            { field: 'description', header: Locales.description, type: 'input', class: 'disabled'},
            { field: 'cost', header: Locales.cost, type: 'currency', disabled: true, class: 'inlineL' },
            { field: 'time', header: Locales.time, type: 'number', disabled: true, class: 'inlineR' },
            { field: 'credits', header: Locales.credits, type: 'input', class: 'disabled' },
            { field: 'issuedDate', header: Locales.issuedDate, type: 'cal', class: 'inlineL' },
            { field: 'expDate', header: Locales.expDate, type: 'cal', class: 'inlineR' }
        ];
        this.flights = [
            { field: 'document' },
            { field: 'description', header: Locales.description, type: 'input', maxlen: 30 },
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(FlightType).map(key => ({ label: FlightType[key], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'issuedDate', header: Locales.issuedDate, type: 'cal' },
            { field: 'startHobbs', header: Locales.startHobbs, type: 'number', class: 'inlineL' },
            { field: 'endHobbs', header: Locales.endHobbs, type: 'number', class: 'inlineR' },
            { field: 'addedOil', header: Locales.addedOil, type: 'number', class: 'inlineL' },
            { field: 'addedFuel', header: Locales.addedFuel, type: 'number', class: 'inlineR' },
            { field: 'cancelation', header: Locales.cancelation, type: 'popup', value: Object.keys(CancelationType).map(key => ({ label: CancelationType[key], value: key })) },
            { field: 'route', header: Locales.route, type: 'input' }
        ];
        const fields = {};
        Object.keys(AircraftCategoryClass).forEach(key => {
            fields[key] = [null];
        });

        this.currencyGroup = new FormGroup(this.initControls(this.currencies));
        this.courseGroup = new FormGroup(this.initControls(this.courses));
        this.flightGroup = new FormGroup(this.initControls(this.flights));

        let oldType: string, oldIssuedDate: Date;
        this.currencyGroup.valueChanges.subscribe(val => {
            if (val.type === 'Other') {
                oldType = null;
            } else if (val.type !== oldType && val.type !== 'Other') {
                oldType = val.type;
                oldIssuedDate = null;
                this.currencyGroup.patchValue({issuedDate: val.issuedDate || new Date()});
            } else if (oldType && (!oldIssuedDate || (val.issuedDate && val.issuedDate.getTime() !== oldIssuedDate.getTime()))) {
                oldIssuedDate = val.issuedDate;
                const type = CurrencyType[oldType],
                    expDate = new Date(val.issuedDate.getTime());
                if (type.length === 2) { // by days
                    expDate.setDate(expDate.getDate() + type[1]);
                } else {
                    let month = type[2];
                    if (val.type === 'Medical' && this.user.birthday && new Date().getFullYear() - new Date(this.user.birthday).getFullYear() < 40) {
                        month = type[3];
                    }
                    expDate.setMonth(expDate.getMonth() + month + 1);
                    expDate.setDate(0);
                }
                this.currencyGroup.patchValue({expDate});
            }
        });
        this.onReset();
   }

   onReset() {
        this.currencyGroup.reset();
        this.currencyGroup.patchValue({type: AppUtils.getKey(CurrencyType, 'Day'), notes: new Note()});
        this.courseGroup.reset();
        this.courseGroup.patchValue({type: AppUtils.getKey(CourseType, 'Part61'), notes: new Note()});
        this.flightGroup.reset();
        this.flightGroup.patchValue({type: AppUtils.getKey(FlightType, 'Rent'), notes: new Note()});
        this._selectedBean = this.formGroup.value;
    }

    get formGroup() {
        switch (this.viweForm) {
            case VIEW_FORM.Currency:
                return this.currencyGroup;
            case VIEW_FORM.Course:
                return this.courseGroup;
            default:
                return this.flightGroup;
        }
    }

    lazyLoad(event?: LazyLoadEvent) {
        /*this.loading(true);
        this.adminService.getActivities(this.user.id, event.first).subscribe(result => {
            this.loading(false);
            this.result = result;
        }, (ex) => this.errorHandler(ex));*/
    }

    onSubmit() {
        this.loading(true);
        const activity = new CommonModel(this.formGroup.value);
        if (activity.id) {
            this.adminService.updateActivity(this.user.id, activity).subscribe(result => {
                this.loading(false);
                Object.assign(this.selectedBean, result);
                this.formGroup.patchValue(result);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.adminService.addActivity(this.user.id, activity).subscribe(result => {
                this.loading(false);
                this.result.data.push(result);
                this.formGroup.patchValue(result);
                this.selectedBean = result;
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex));
        }
    }

    doDelete(): void {
        this.loading(true);
        this.adminService.deleteActivity(this.user.id, this.selectedBean.id).subscribe(_  => {
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
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, UserTabBaseModule],
    exports: [ActivityTabComponent],
    declarations: [ActivityTabComponent]
})
export class ActivityTabModule {
}
