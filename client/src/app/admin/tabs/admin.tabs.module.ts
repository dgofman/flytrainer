import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

@Component({
    selector: 'account-tab',
    templateUrl: './account-tab.component.html'
})
export class AccountTabComponent {
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
  imports: [CommonModule],
  exports: [AccountTabComponent, CertificateTabComponent, ContactTabComponent, CourseTabComponent, DocumentTabComponent],
  declarations: [AccountTabComponent, CertificateTabComponent, ContactTabComponent, CourseTabComponent, DocumentTabComponent]
})
export class AdminTabsModule {
}
