import Locales from '@locales/admin';
import { Component, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { User } from 'src/modules/models/base.model';
import { AdminService } from 'src/services/admin.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared.module';
import { TableResult } from 'src/modules/models/table.result';
import { FTTableEvent } from 'src/app/component/ft-table/ft-table.component';
import { CourseTabBaseDirective, CourseTabBaseModule } from '../course.component';

@Component({
    selector: 'participant-tab',
    templateUrl: './participant-tab.component.html'
})
export class ParticipantTabComponent extends CourseTabBaseDirective {
    result: TableResult<User>;

    constructor(confirmationService: ConfirmationService, formBuilder: FormBuilder, private adminService: AdminService) {
        super(confirmationService, formBuilder);
        this.controls = [];
        this.initFormGroup();
    }

    lazyLoad(event: LazyLoadEvent) {
        this.loading(true);
        const model = {
            first: event.first,
            total: 25,
            filter: {
                first_show: true,
                last_show: true,
                username_show: true
            }
        } as FTTableEvent;
        this.subs.add(this.adminService.getUsers(model).subscribe(result => {
            this.loading(false);
            this.result = result;
        }, (ex) => this.errorHandler(ex)));
    }

    onSubmit() {
        /*const participant = new CommonModel(this.formGroup.value);
        this.loading(true);
        if (participant.id) {
            this.subs.add(this.adminService.updateParticipant(this.user.id, participant).subscribe(result => {
                this.loading(false);
                Object.assign(this.selectedBean, result);
                this.formGroup.patchValue(result);
                this.eventService.emit(EventType.Refresh, null);
                this.success(Locales.recordUpdated);
            }, (ex) => this.errorHandler(ex)));
        } else {
            this.subs.add(this.adminService.addParticipant(this.user.id, participant).subscribe(result => {
                this.loading(false);
                this.result.push(result);
                this.formGroup.patchValue(result);
                this.selectedBean = result;
                this.eventService.emit(EventType.Refresh, null);
                this.success(Locales.recordCreated);
            }, (ex) => this.errorHandler(ex)));
        }*/
    }

    doDelete(): void {
        throw new Error('UnsupportedOperationException: Delete operation is not supported.');
    }

    resetBean() {
       return { };
    }
}


@NgModule({
    imports: [CommonModule, AdminSharedModule, CourseTabBaseModule],
    exports: [ParticipantTabComponent],
    declarations: [ParticipantTabComponent]
})
export class ParticipantTabModule {
}
