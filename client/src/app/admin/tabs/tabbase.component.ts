import Locales from '@locales/admin';
import { User } from 'src/modules/models/user';
import { Document } from 'src/modules/models/document';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { AppBaseDirective } from 'src/app/app.base.component';
import { Input, Component, NgModule, Directive } from '@angular/core';
import { ColumnType } from 'src/app/component/ft-table/ft-table.component';
import { AdminSharedModule } from '../admin-shared.module';
import { ConfirmationService } from 'primeng/api';
import { BaseModel } from 'src/modules/models/base.model';

@Component({
  selector: 'admin-field',
  template: `
    <div [formGroup]="parentGroup" class="row" *ngIf="c.type">
        <label *ngIf="c.header">{{c.header}}</label>
        <div  *ngIf="c.field=='other' && parentGroup.controls.type.value == 'Other'">
            <label>{{Locales.other}}</label>
            <input formControlName="other" pInputText/>
        </div>
        <div  *ngIf="c.field=='pobox' && parentGroup.controls.type.value != 'Home'">
            <label>{{Locales.pobox}}</label>
            <input formControlName="pobox" pInputText/>
        </div>
        <div  *ngIf="c.field=='url' && parentGroup.controls.type.value == 'OnlineDocument'">
            <label>{{Locales.url}}</label>
            <input formControlName="url" pInputText placeholder="http://www.company.com"/>
        </div>
        <p-inputNumber *ngIf="c.type =='number'" [showButtons]="true" [formControlName]="c.field" [min]="c.value[0]" [max]="c.value[1]"></p-inputNumber>
        <input *ngIf="c.type =='input'" [formControlName]="c.field" pInputText [attr.disabled]="isDisabled(c)" />
        <input *ngIf="c.type =='password'" [formControlName]="c.field" type="password" pPassword autocomplete="off new-password" [attr.disabled]="isDisabled(c)"/>
        <p-dropdown *ngIf="c.type=='popup'" appendTo="body" [formControlName]="c.field" [options]="c.value" [placeholder]="c.placeholder"></p-dropdown>
        <p-autoComplete *ngIf="c.type == 'auto'" ftAutoComplete [formControlName]="c.field" [data]="c.value"></p-autoComplete>
        <p-inputMask *ngIf="c.type=='mask'" [mask]="c.value" [placeholder]="c.placeholder" [formControlName]="c.field"></p-inputMask>
        <p-calendar *ngIf="c.type=='cal'" placeholder="mm/dd/yyyy" [monthNavigator]="true" [yearNavigator]="true" [yearRange]="c.value" showButtonBar="true" showIcon="true" appendTo="body" [formControlName]="c.field"></p-calendar>
        <div *ngIf="c.type=='switch'"><p-inputSwitch [formControlName]="c.field" binary="true"></p-inputSwitch></div>
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

    // convenience getter for easy access to form fields
    get f() {
        return this.parentGroup.controls;
    }

    isDisabled(c: ColumnType) {
        return c.class && c.class.indexOf('disabled') !== -1 ? true : null;
    }
}

@Directive()
export abstract class TabBaseDirective extends AppBaseDirective {
    Locales = Locales;
    formGroup: FormGroup;
    controls: ColumnType[];

    // tslint:disable-next-line: variable-name
    private _selectedBean: BaseModel;

    @Input() user: User;

    constructor(private confirmationService: ConfirmationService) {
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
        this.formGroup.patchValue(bean);
    }

    onReset() {
        this.formGroup.reset();
        this._selectedBean = this.formGroup.value;
    }

    onDelete() {
        this.confirmationService.confirm({
            key: 'deleteRecord',
            header: Locales.deleteHeader,
            message: Locales.deleteRecord,
            accept: () => {
                this.doDelete();
            }
        });
    }

    onUploadDocument(event: any, error: boolean) {
        this.loading(false);
        if (error) {
            this.errorHandler(event);
            event.files.splice(0, event.files.length);
        } else {
            if (event.files.length) {
                const oldDoc = this.selectedBean.document || {},
                    file = event.files[0],
                    doc = new Document({
                        id: oldDoc.id,
                        fileName: file.name,
                        filePath: event.originalEvent.body,
                        contentType: file.type,
                        size: file.size
                    });
                this.selectedBean.document = doc;
                this.formGroup.patchValue({document: doc});
            }
        }
    }

    deleteDocument(document: Document) {
        if (!document.id) {
            this.selectedBean.document = null;
        } else {
            this.selectedBean.document = new Document({id: document.id});
        }
        this.formGroup.patchValue({document: this.selectedBean.document});
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule],
    exports: [AdminFieldComponent],
    declarations: [AdminFieldComponent]
})
export class TabBaseModule {
}
