import { NgModule } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FTAutoCompleteModule } from 'src/app/component/ft-autocomplete/ft-autocomplete.component';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
        AutoCompleteModule,
        ButtonModule,
        CheckboxModule,
        CommonModule,
        DropdownModule,
        FormsModule,
        FTAutoCompleteModule,
        FileUploadModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextareaModule,
        InputTextModule,
        ReactiveFormsModule
    ];
}
