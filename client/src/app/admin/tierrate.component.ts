import Locales from '@locales/admin';
import { Component, ViewChild, Directive, Input, NgModule } from '@angular/core';
import { AdminService } from 'src/services/admin.service';
import { AppBaseDirective } from '../app.base.component';
import { ColumnType, TierType } from 'src/modules/models/constants';
import { CommonModel } from 'src/modules/models/base.model';
import { TableResult } from 'src/modules/models/table.result';
import { EmitEvent, EventType } from 'src/services/event.service';
import { AppHeaderComponent } from '../app.component';
import { FTDialogComponent } from '../component/ft-dialog/ft-dialog.component';
import { AbstractTabDirective, AbstractTabModule } from './abstract-tab.component';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from './admin-shared.module';
import { FormBuilder } from '@angular/forms';

@Component({
  templateUrl: './tierrate.component.html',
  styleUrls: ['./admin.component.less']
})
export class TierRateComponent extends AppBaseDirective {
  Locales = Locales;
  result: TableResult<CommonModel>;
  selectedTier: CommonModel;

  @ViewChild(FTDialogComponent) dialog: FTDialogComponent;

  cols: ColumnType[] = [
    { field: 'id', header: Locales.id, type: 'input', width: 50 },
    { field: 'version', show: 'never'},
    { field: 'type', header: Locales.type, type: 'popup', show: true, width: 100, value: Object.keys(TierType).map(key => ({ label: TierType[key], value: key })) },
    { field: 'other', type: 'input', header: Locales.other, width: 100 },
    { field: 'description', type: 'input', show: true, header: Locales.description, width: 200 },
    { field: 'rate', type: 'number', show: true, header: Locales.rate, width: 100, class: 'inlineL' },
    { field: 'isPercent', type: 'switch', show: true, header: Locales.isPercent, width: 70, align: 'center', format: 'bool' },
    { field: 'isDiscount', type: 'switch', show: true, header: Locales.isDiscount, width: 70, align: 'center', format: 'bool' },
    { field: 'isOverride', type: 'switch', header: Locales.isOverride, width: 70, align: 'center', format: 'bool' },
    { field: 'isDisable', type: 'switch', show: true, header: Locales.isDisabled, width: 70, align: 'center', format: 'bool' },
    { field: 'minRate', type: 'number', header: Locales.minRate, width: 100, class: 'inlineL' },
    { field: 'maxRate', type: 'number', header: Locales.maxRate, width: 100, class: 'inlineR' },
    { field: 'code', type: 'input', header: Locales.promotionCode, width: 150 },
    { field: 'effectDate', type: 'cal', show: true, header: Locales.effectiveDate, width: 100, format: 'date' },
    { field: 'expDate', type: 'cal', header: Locales.expDate, width: 100, format: 'date' },
    { field: 'createdDate', type: 'cal', header: Locales.createdDate, width: 200, format: 'datetime' },
    { field: 'modifiedDate', type: 'cal', header: Locales.modifiedDate, width: 200, format: 'datetime' },
    { field: 'whoCreated', type: 'input', header: Locales.whoCreated, width: 200 },
    { field: 'whoModified', type: 'input', header: Locales.whoModified, width: 200 }
  ];

  constructor(public adminService: AdminService) {
    super();
  }

  updateDialog(model: CommonModel) {
    let path = [Locales.admin, Locales.tierRates];
    if (model.id) {
      path = path.concat(model.description || model.type);
    }
    this.dialog.path = path;
    for (let i = 1; i < this.dialog.tabView.tabs.length; i++) {
      this.dialog.tabView.tabs[i].disabled = !model.id;
    }
    this.selectedTier = model;
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
        this.adminService.getTiers(event.data).subscribe(result => {
          this.loading(false);
          this.result = result;
        }, (ex) => this.errorHandler(ex));
        break;
    }
  }
}

@Directive()
export abstract class TierTabBaseDirective extends AbstractTabDirective {
    @Input() tierRate: CommonModel;

    constructor(confirmationService: ConfirmationService, formBuilder: FormBuilder) {
        super(confirmationService, formBuilder);
    }
}

@NgModule({
    imports: [CommonModule, AdminSharedModule, AbstractTabModule],
    exports: [AbstractTabModule]
})
export class TierTabBaseModule {
}
