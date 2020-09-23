import Locales from '@locales/admin';
import { User } from 'src/modules/models/user';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { AppBaseDirective } from 'src/app/app.base.component';
import { Input, Component, NgModule, Directive } from '@angular/core';
import { ColumnType } from 'src/app/component/ft-table/ft-table.component';
import { AdminSharedModule } from '../admin-shared.module';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'admin-field',
  template: `
    <div [formGroup]="parentGroup">
        <label *ngIf="c.header">{{c.header}}</label>
        <div  *ngIf="c.field=='other' && parentGroup.controls.type.value =='Other'">
            <label>{{Locales.other}}</label>
            <input formControlName="other" pInputText/>
        </div>
        <div  *ngIf="c.field=='pobox' && parentGroup.controls.type.value !='Home'">
            <label>{{Locales.pobox}}</label>
            <input formControlName="pobox" pInputText/>
        </div>
        <input *ngIf="c.type =='input'" [formControlName]="c.field" pInputText />
        <p-dropdown *ngIf="c.type=='popup'" appendTo="body" [formControlName]="c.field" [options]="c.value" [placeholder]="c.placeholder"></p-dropdown>
        <p-autoComplete *ngIf="c.type == 'auto'" ftAutoComplete [formControlName]="c.field" [data]="c.value"></p-autoComplete>
        <p-inputMask *ngIf="c.type=='mask'" [mask]="c.value" [placeholder]="c.placeholder" [formControlName]="c.field"></p-inputMask>
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
}

@Directive()
export abstract class TabBaseDirective extends AppBaseDirective {
    Locales = Locales;
    formGroup: FormGroup;
    controls: ColumnType[];

    @Input() user: User;

    constructor(private confirmationService: ConfirmationService) {
        super();
    }

    abstract doDelete(): void;

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
}

@NgModule({
    imports: [CommonModule, AdminSharedModule],
    exports: [AdminFieldComponent],
    declarations: [AdminFieldComponent]
})
export class TabBaseModule {
}
