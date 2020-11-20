import Locales from '@locales/admin';
import { FTIcons } from '../component/ft-menu/ft-menu.component';
import { Document } from 'src/modules/models/base.model';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AppBaseDirective } from 'src/app/app.base.component';
import { Input, Component, NgModule, Directive } from '@angular/core';
import { ColumnType } from 'src/modules/models/constants';
import { AdminSharedModule } from './admin-shared.module';
import { ConfirmationService } from 'primeng/api';
import { AbstractBase } from 'src/modules/models/base.model';

@Component({
    selector: 'admin-field',
    template: `
    <div [formGroup]="parentGroup" class="row" *ngIf="c.type">
        <label *ngIf="c.type!='check' && c.header">{{c.header}}</label>
        <p-checkbox *ngIf="c.type=='check'" [label]="c.header" [formControlName]="c.field" binary="true"></p-checkbox>
        <p-inputNumber *ngIf="c.type =='currency'" mode="currency" currency="USD" [formControlName]="c.field"></p-inputNumber>
        <p-inputNumber *ngIf="c.type =='number'" mode="decimal" [minFractionDigits]="c.maxlen === undefined ? 2 : c.maxlen" [maxFractionDigits]="c.maxlen === undefined ? 2 : c.maxlen" [formControlName]="c.field" [min]="c.value && c.value[0] || 0" [max]="c.value && c.value[1]"></p-inputNumber>
        <input *ngIf="c.type =='phone'" ftFTFormatter [control]="c" [formControlName]="c.field" pInputText [attr.disabled]="isDisabled(c)" placeholder="xxx-xxx-xxxx" [attr.maxlength]="c.maxlen || 30"/>
        <input *ngIf="c.type =='input'" ftFTFormatter [control]="c" [formControlName]="c.field" pInputText [attr.disabled]="isDisabled(c)" [placeholder]="c.placeholder || ''" [attr.maxlength]="c.maxlen"/>
        <input *ngIf="c.type =='password'" [formControlName]="c.field" type="password" pPassword autocomplete="off new-password" [attr.disabled]="isDisabled(c)" [placeholder]="c.placeholder || ''" [attr.maxlength]="c.maxlen"/>
        <p-dropdown *ngIf="c.type=='popup'" appendTo="body" [formControlName]="c.field" [options]="c.value" [placeholder]="c.placeholder || ''"></p-dropdown>
        <p-autoComplete *ngIf="c.type == 'auto'" ftAutoComplete [formControlName]="c.field" [data]="c.value"></p-autoComplete>
        <p-inputMask *ngIf="c.type=='mask'" [mask]="c.value" [placeholder]="c.placeholder || ''" [formControlName]="c.field" unmask="true"></p-inputMask>
        <p-calendar *ngIf="c.type=='cal'" ftCalendar [formControlName]="c.field" [showTime]="c.value && c.value.showTime"></p-calendar>
        <div *ngIf="c.type=='switch'" style="padding: 3px 0"><p-inputSwitch [formControlName]="c.field" binary="true"></p-inputSwitch></div>
        <div *ngIf="c.field=='other' && parentGroup.controls.type.value == 'Other'">
            <label>{{Locales.other}}</label>
            <input formControlName="other" pInputText [attr.maxlength]="c.maxlen || 30"/>
        </div>
        <div *ngIf="c.type=='radio'" style="margin: 5px 0">
            <p-radioButton [name]="c.field" [label]="c.value[0]" [value]="c.value[2]" [formControlName]="c.field"></p-radioButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <p-radioButton [name]="c.field" [label]="c.value[1]" [value]="c.value[3]" [formControlName]="c.field"></p-radioButton>
        </div>
        <ng-container *ngIf="c.template" [ngTemplateOutlet]="templates[c.template]" [ngTemplateOutletContext]="{control:c, group: parentGroup}"></ng-container>
        <div *ngIf="f[c.field].errors" style="color: red; ">
            <div *ngIf="f[c.field].errors.required ">{{c.header}} is required</div>
        </div>
    </div>
    `,
    styles: [`
        :not(form).ng-dirty.ng-invalid {
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: none;
        }
    `]
})
export class AdminFieldComponent {
    Locales = Locales;
    @Input() parentGroup: FormGroup;
    @Input() c: ColumnType;
    @Input() templates: any = {};

    // convenience getter for easy access to form fields
    get f() {
        return this.parentGroup.controls;
    }

    isDisabled(c: ColumnType) {
        return c.class && c.class.indexOf('disabled') !== -1 ? true : null;
    }
}

@Directive()
export abstract class AbstractTabDirective extends AppBaseDirective {
    Locales = Locales;
    icons = FTIcons;
    formGroup: FormGroup;
    controls: ColumnType[];

    // tslint:disable-next-line: variable-name
    protected _selectedBean: AbstractBase;

    constructor(protected confirmationService: ConfirmationService, protected formBuilder: FormBuilder) {
        super();
    }

    abstract doDelete(): void;

    get selectedBean(): any {
        return this._selectedBean;
    }

    set selectedBean(bean: any) {
        if (typeof bean !== 'string') {
            this.updateSelectedBean(bean);
        }
    }

    updateSelectedBean(bean: any) {
        this._selectedBean = bean;
        this.formGroup.reset();
        this.formGroup.patchValue(bean || {});
    }

    initControls(fieldControls: ColumnType[], fields?: any) {
        const controls = Object.assign({
            id: new FormControl(),
            version: new FormControl(),
            notes: this.formBuilder.group({
                id: [null], content: [null]
            })
        }, fields || {});
        fieldControls.forEach(c => {
            controls[c.field] = new FormControl({value: null, disabled: c.disabled}, c.validators);
        });
        return controls;
    }

    initFormGroup(fields?: any) {
        const controls = this.initControls(this.controls, fields);
        this.formGroup = new FormGroup(controls);
        this.onReset();
    }

    onReset() {
        this.formGroup.reset();
        this.formGroup.patchValue(this.resetBean());
        this._selectedBean = this.formGroup.value;
    }

    resetBean() {
        return this.formGroup.value;
    }

    onDelete() {
        this.confirmationService.confirm({
            key: 'confDialog',
            icon: 'pi pi-exclamation-triangle',
            header: Locales.deleteHeader,
            message: Locales.deleteRecord,
            accept: () => {
                this.doDelete();
            }
        });
    }

    onUploadDocument(event: any, error: boolean, formGroup?: FormGroup) {
        const doc = this.doUpload(event, error);
        this.selectedBean.document = doc;
        if (!formGroup) {
            formGroup = this.formGroup;
        }
        formGroup.patchValue({ document: doc });
    }

    doUpload(event: any, error: boolean): Document {
        this.loading(false);
        if (error) {
            this.errorHandler(event);
            event.files.splice(0, event.files.length);
        } else if (event.files.length) {
            const file = event.files[0];
            return new Document({
                id: (this.selectedBean && this.selectedBean.document || {}).id,
                fileName: file.name,
                filePath: event.originalEvent.body,
                contentType: file.type,
                size: file.size
            });
        }
        return null;
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule],
    exports: [AdminFieldComponent],
    declarations: [AdminFieldComponent]
})
export class AbstractTabModule {
}
