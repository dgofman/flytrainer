import Locales from '@locales/admin';
import { Component, ViewChild } from '@angular/core';
import { AdminService } from 'src/services/admin.service';
import { AppBaseDirective } from '../app.base.component';
import { Country, State, ColumnType, CourseType, AddressType } from 'src/modules/models/constants';
import { CommonModel } from 'src/modules/models/base.model';
import { TableResult } from 'src/modules/models/table.result';
import { EmitEvent, EventType } from 'src/services/event.service';
import { AppHeaderComponent } from '../app.component';
import { FTDialogComponent } from '../component/ft-dialog/ft-dialog.component';
import { Validators } from '@angular/forms';

@Component({
  templateUrl: './course.component.html',
  styleUrls: ['./admin.component.less']
})
export class CourseComponent extends AppBaseDirective {
  Locales = Locales;
  result: TableResult<CommonModel>;
  locationControls: ColumnType[];
  selectedCourse: CommonModel;

  @ViewChild(FTDialogComponent) dialog: FTDialogComponent;

  cols: ColumnType[] = [
    { field: 'id', header: Locales.id, type: 'input', width: 50 },
    { field: 'version', show: 'never'},
    { field: 'type', header: Locales.type, type: 'popup', show: true, width: 100, value: Object.keys(CourseType).map(key => ({ label: CourseType[key], value: key })) },
    { field: 'other', type: 'input', header: Locales.other, width: 100 },
    { field: 'description', type: 'input', show: true, header: Locales.description, width: 200 },
    { field: 'cost', type: 'currency', show: true, header: Locales.cost, width: 100, class: 'inlineL' },
    { field: 'time', type: 'number', show: true, header: Locales.time, width: 100, class: 'inlineL' },
    { field: 'is_online', type: 'switch', show: true, header: Locales.isOnline, width: 70, align: 'center', format: 'bool' },
    { field: 'credits', type: 'input', show: true, header: Locales.credits, width: 150 },
    { field: 'createdDate', type: 'cal', header: Locales.createdDate, width: 200, format: 'datetime' },
    { field: 'modifiedDate', type: 'cal', header: Locales.modifiedDate, width: 200, format: 'datetime' },
    { field: 'whoCreated', type: 'input', header: Locales.whoCreated, width: 200 },
    { field: 'whoModified', type: 'input', header: Locales.whoModified, width: 200 }
  ];

  constructor(public adminService: AdminService) {
    super();
    this.locationControls = [ // location_id
      { field: 'id' },
      { field: 'version' },
      { field: 'type', header: Locales.type, type: 'popup', validators: [Validators.required], value: Object.keys(AddressType).map(key => ({ label: AddressType[key], value: key })) },
      { field: 'other', type: 'hide' },
      { field: 'pobox', type: 'hide', template: 'pobox' },
      { field: 'street', header: Locales.street, type: 'input', maxlen: 120, validators: [Validators.required] },
      { field: 'city', header: Locales.city, type: 'input', maxlen: 50, validators: [Validators.required] },
      { field: 'code', header: Locales.code, type: 'input', maxlen: 16, validators: [Validators.required], placeholder: 'ex. 95134' },
      { field: 'state', header: Locales.state, type: 'auto', validators: [Validators.required], value: State, class: 'inlineL' },
      { field: 'country', header: Locales.country, type: 'auto', validators: [Validators.required], value: Country, class: 'inlineR' },
      { field: 'phone', header: Locales.phone, type: 'phone', class: 'inlineL' },
      { field: 'fax', header: Locales.fax, type: 'phone', class: 'inlineR' }
    ];
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
    /*switch (event.message) {
      case EventType.Load:
        this.loading(true);
        this.adminService.getCourses(event.data).subscribe(result => {
          this.loading(false);
          this.result = result;
        }, (ex) => this.errorHandler(ex));
        break;
    }*/
  }
}
