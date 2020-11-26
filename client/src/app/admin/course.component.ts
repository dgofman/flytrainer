import Locales from '@locales/admin';
import { Component, ViewChild, Input, Directive, NgModule } from '@angular/core';
import { AdminService } from 'src/services/admin.service';
import { AppBaseDirective } from '../app.base.component';
import { ColumnType, CourseType } from 'src/modules/models/constants';
import { CommonModel } from 'src/modules/models/base.model';
import { TableResult } from 'src/modules/models/table.result';
import { EmitEvent, EventType, EventService } from 'src/services/event.service';
import { AppHeaderComponent } from '../app.component';
import { FTDialogComponent } from '../component/ft-dialog/ft-dialog.component';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AbstractTabDirective, AbstractTabModule } from './abstract-tab.component';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from './admin-shared.module';
import { FTTableComponent } from '../component/ft-table/ft-table.component';

@Component({
  templateUrl: './course.component.html',
  styleUrls: ['./admin.component.less']
})
export class CourseComponent extends AppBaseDirective {
  Locales = Locales;
  result: TableResult<CommonModel>;
  selectedCourse: CommonModel;

  @ViewChild(FTTableComponent) table: FTTableComponent;
  @ViewChild(FTDialogComponent) dialog: FTDialogComponent;

  cols: ColumnType[] = [
    { field: 'id', header: Locales.id, type: 'input', width: 50 },
    { field: 'version', show: 'never'},
    { field: 'type', header: Locales.type, type: 'popup', show: true, width: 100, value: Object.keys(CourseType).map(key => ({ label: CourseType[key], value: key })) },
    { field: 'other', type: 'input', header: Locales.other, width: 100 },
    { field: 'description', type: 'input', show: true, header: Locales.description, width: 200 },
    { field: 'cost', type: 'currency', show: true, header: Locales.cost, width: 100, class: 'inlineL' },
    { field: 'duration', type: 'number', show: true, header: Locales.duration, width: 100, class: 'inlineL' },
    { field: 'startDate', type: 'cal', header: Locales.startDate, width: 200, format: 'datetime' },
    { field: 'endDate', type: 'cal', header: Locales.endDate, width: 200, format: 'datetime' },
    { field: 'isOnline', type: 'switch', show: true, header: Locales.isOnline, width: 70, align: 'center', format: 'bool' },
    { field: 'credits', type: 'input', show: true, header: Locales.credits, width: 150 },
    { field: 'createdDate', type: 'cal', header: Locales.createdDate, width: 200, format: 'datetime' },
    { field: 'modifiedDate', type: 'cal', header: Locales.modifiedDate, width: 200, format: 'datetime' },
    { field: 'whoCreated', type: 'input', header: Locales.whoCreated, width: 200 },
    { field: 'whoModified', type: 'input', header: Locales.whoModified, width: 200 }
  ];

  constructor(public adminService: AdminService, eventService: EventService) {
    super();
    eventService.emmiter.subscribe((event: EmitEvent) => {
      switch (event.message) {
        case EventType.Refresh:
          if (event.data) {
            this.updateDialog(event.data);
          }
          this.table.expandedRows = {};
          this.table.refresh();
          break;
      }
    });
  }

  updateDialog(model: CommonModel) {
    let path = [Locales.admin, Locales.courses];
    if (model.id) {
      path = path.concat(model.description || model.type);
    }
    this.dialog.path = path;
    for (let i = 1; i < this.dialog.tabView.tabs.length; i++) {
      this.dialog.tabView.tabs[i].disabled = !model.id;
    }
    this.selectedCourse = model;
    this.dialog.selectedItem = model;
    this.dialog.show = true;
  }

  onAddRate() {
    this.updateDialog(new CommonModel());
    AppHeaderComponent.toggleArrowMenu = false;
  }

  onEdit(model: CommonModel) {
    this.updateDialog(model);
    AppHeaderComponent.toggleArrowMenu = false;
  }

  eventTableHandler(event: EmitEvent) {
    switch (event.message) {
      case EventType.Load:
        this.loading(true);
        this.adminService.getCourses(event.data).subscribe(result => {
          this.loading(false);
          this.result = result;
        }, (ex) => this.errorHandler(ex));
        break;
    }
  }
}

@Directive()
export abstract class CourseTabBaseDirective extends AbstractTabDirective {
    @Input() course: CommonModel;

    constructor(confirmationService: ConfirmationService, formBuilder: FormBuilder) {
        super(confirmationService, formBuilder);
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, AbstractTabModule],
    exports: [AbstractTabModule]
})
export class CourseTabBaseModule {
}
