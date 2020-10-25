import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { TabBaseDirective } from './tabbase.component';

@Component({
    selector: 'course-tab',
    templateUrl: './course-tab.component.html'
})
export class CourseTabComponent extends TabBaseDirective {
    doDelete() {}
}

@NgModule({
  imports: [CommonModule],
  exports: [CourseTabComponent],
  declarations: [CourseTabComponent]
})
export class TempTabsModule {
}
