import { NgModule } from '@angular/core';
import { AdminComponentModule } from './admin.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FTAutoCompleteModule } from 'src/app/component/ft-autocomplete/ft-autocomplete.component';
import { FTCalendarDirectiveModule } from '../component/ft-calendar/ft-calendar.component';
import { FTFormatterDirectiveModule } from '../component/ft-formatter/ft-formatter.component';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [ ],
    imports: [
        ...AdminSharedModule.list
    ],
    exports: [
        ...AdminSharedModule.list
    ]
})
export class AdminSharedModule {

    static list = [
        AdminComponentModule,
        AutoCompleteModule,
        ButtonModule,
        CalendarModule,
        CheckboxModule,
        CommonModule,
        DropdownModule,
        FormsModule,
        FontAwesomeModule,
        FTAutoCompleteModule,
        FTCalendarDirectiveModule,
        FTFormatterDirectiveModule,
        FileUploadModule,
        InputMaskModule,
        InputNumberModule,
        InputSwitchModule,
        InputTextareaModule,
        InputTextModule,
        PasswordModule,
        ReactiveFormsModule,
        TableModule
    ];
}
