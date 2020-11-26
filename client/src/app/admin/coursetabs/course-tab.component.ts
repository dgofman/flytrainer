import Locales from '@locales/admin';
import { Component, NgModule, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { CommonModel, Address, Note } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { Country, State, AddressType, ColumnType, CourseType } from 'src/modules/models/constants';
import { CourseTabBaseDirective, CourseTabBaseModule } from '../course.component';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';
import { AppUtils } from 'src/app/utils/app-utils';
import { EventType, EventService } from 'src/services/event.service';

@Component({
    selector: 'course-tab',
    templateUrl: './course-tab.component.html',
    styles: [
        `p.row {
            cursor: pointer;
            font-weight: bold;
        }
        `
    ]
})
export class CourseTabComponent extends CourseTabBaseDirective implements OnInit {
    locationControls: ColumnType[];
    isLocation: boolean;

    constructor(confirmationService: ConfirmationService, formBuilder: FormBuilder, private adminService: AdminService, private eventService: EventService) {
        super(confirmationService, formBuilder);
        this.controls = [
            { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(CourseType).map(key => ({ label: CourseType[key], value: key })) },
            { field: 'other', type: 'hide' },
            { field: 'description', header: Locales.description, type: 'input', maxlen: 30 },
            { field: 'startDate', header: Locales.startDate, type: 'cal', value: {showTime: true} },
            { field: 'endDate', header: Locales.endDate, type: 'cal', value: {showTime: true} },
            { field: 'cost', header: Locales.cost, type: 'currency', class: 'inlineL' },
            { field: 'duration', header: Locales.duration, type: 'number', maxlen: 1, class: 'inlineR'},
            { field: 'credits', header: Locales.credits, type: 'input', maxlen: 100 },
            { field: 'isOnline', type: 'hide'}
        ];
        this.locationControls = [
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
        this.locationControls.forEach(c => {
            fields[c.field] = [null, c.validators];
        });
        this.initFormGroup({location: this.formBuilder.group(fields)});
        this.formGroup.controls.location.disable();
    }

    ngOnInit(): void {
       if (this.course && this.course.id) {
            this.loading(true);
            this.adminService.getCourse(this.course.id).subscribe(result => {
                this.loading(false);
                this.selectedBean = Object.assign(this.defaultBean, result);
                Object.assign(this.course, this.selectedBean);
                this.defineLocation(result.location && result.location.id !== null, this.formGroup.controls);
            }, (ex) => this.errorHandler(ex));
        }
    }

    defineLocation(state: boolean, controls: any) {
        this.isLocation = state;
        if (state) {
            controls.location.enable();
        } else {
            controls.location.disable();
        }
    }

    onSubmit() {
        const course = new CommonModel(this.formGroup.value),
            location = course.location;
        this.loading(true);
        if (location && !location.id) {
            location.description = location.type + ' Course ' + course.type;
            location.isPrimary = 1;
        }
        if (course.id) {
            this.adminService.updateCourse(course).subscribe(result => {
                this.loading(false);
                Object.assign(this.selectedBean, result);
                Object.assign(this.course, result);
                this.formGroup.patchValue(result);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex));
        } else {
            this.adminService.createCourse(course).subscribe(result => {
                this.loading(false);
                this.selectedBean = result;
                this.eventService.emit(EventType.Refresh, result);
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex));
        }
    }

    doDelete(): void {
        throw new Error('Cannot delete user from UI');
    }

    onReset() {
        super.onReset();
        this.formGroup.patchValue(this.defaultBean);
    }

    get defaultBean() {
       return { type: AppUtils.getKey(CourseType, 'Part61'), notes: new Note(), location: new Address({type: AppUtils.getKey(AddressType, 'Business'), state: this.environment.homeState, country: this.environment.homeCountry}) };
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, CourseTabBaseModule],
    exports: [CourseTabComponent],
    declarations: [CourseTabComponent]
})
export class CourseTabModule {
}
