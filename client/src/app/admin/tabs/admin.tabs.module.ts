import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Locales from '@locales/admin';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { AppBaseDirective } from 'src/app/app.base.component';
import { ColumnType } from 'src/app/component/ft-table/ft-table.component';
import { Address } from 'src/modules/models/address';
import {AdminService} from 'src/services/admin.service';

@Component({
    selector: 'account-tab',
    templateUrl: './account-tab.component.html'
})
export class AccountTabComponent {
}

@Component({
    selector: 'address-tab',
    templateUrl: './address-tab.component.html'
})


export class AddressTabComponent extends AppBaseDirective {
    Locales = Locales;
    registerForm: FormGroup;
    controls: ColumnType[];

    constructor(private adminService: AdminService) {
        super();
        this.controls = [
            { field: 'userName', header: Locales.username, validators: [Validators.required] },
            { field: 'street', header: Locales.street, validators: [Validators.required] },
            { field: 'city', header: Locales.city, validators: [Validators.required] },
            { field: 'state', header: Locales.state, validators: [Validators.required] },
            { field: 'zip', header: Locales.zipCode, validators: [Validators.required] },
            { field: 'country', header: Locales.country, validators: [Validators.required] }
        ];
        const controls = { id: new FormControl() };
        this.controls.forEach(c => {
            controls[c.field] = new FormControl(null, c.validators);
        });
        this.registerForm = new FormGroup(controls);
        this.registerForm.patchValue({ userName: 'HELLO' });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        const address = new Address(this.registerForm.value as any);
        this.loading(true);
        this.adminService.address(address).subscribe(result => {
            this.loading(false);
            console.log(result);
        }, (ex) => this.errorHandler(ex));

        // display form values on success
    }

    onReset() {
        this.registerForm.reset();
    }
}



@Component({
    selector: 'certificate-tab',
    templateUrl: './certificate-tab.component.html'
})
export class CertificateTabComponent {
}

@Component({
    selector: 'contact-tab',
    templateUrl: './contact-tab.component.html'
})
export class ContactTabComponent {
}

@Component({
    selector: 'course-tab',
    templateUrl: './course-tab.component.html'
})
export class CourseTabComponent {
}

@Component({
    selector: 'document-tab',
    templateUrl: './document-tab.component.html'
})
export class DocumentTabComponent {
}

@NgModule({
    imports: [CommonModule, InputTextModule, ButtonModule, InputMaskModule, ReactiveFormsModule],
    exports: [AccountTabComponent, AddressTabComponent, CertificateTabComponent, ContactTabComponent, CourseTabComponent, DocumentTabComponent],
    declarations: [AccountTabComponent, AddressTabComponent, CertificateTabComponent, ContactTabComponent, CourseTabComponent, DocumentTabComponent]
})
export class AdminTabsModule {
}

