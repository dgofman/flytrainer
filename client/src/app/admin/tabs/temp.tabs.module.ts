import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { TabBaseDirective } from './tabbase.component';

@Component({
    selector: 'account-tab',
    templateUrl: './account-tab.component.html'
})
export class AccountTabComponent extends TabBaseDirective {
    doDelete() {}
}

@Component({
    selector: 'contact-tab',
    templateUrl: './contact-tab.component.html'
})
export class ContactTabComponent extends TabBaseDirective {
    doDelete() {}
}

@Component({
    selector: 'course-tab',
    templateUrl: './course-tab.component.html'
})
export class CourseTabComponent extends TabBaseDirective {
    doDelete() {}
}




@NgModule({
  imports: [CommonModule],
  exports: [AccountTabComponent, ContactTabComponent, CourseTabComponent],
  declarations: [AccountTabComponent, ContactTabComponent, CourseTabComponent]
})
export class TempTabsModule {
}
