import Locales from '@locales/common';
import { OnInit, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AppUtils } from '../utils/app-utils';
import { EventType, FTTableFormProviderDirective } from './ft-table.component';
import { BaseModel } from 'src/modules/models/base.model';

@Directive()
export abstract class AdminFormDirective implements OnInit {
  Locales = Locales;
  AppUtils = AppUtils;
  data: any;
  frmGroup: FormGroup;

  constructor(protected formProvider: FTTableFormProviderDirective, protected confirmationService: ConfirmationService) {
  }

  abstract doDelete(): void;

  ngOnInit(): void {
    this.setData(this.formProvider.data);
  }

  setData(data: any) {
    if (!this.data) {
      this.data = data;
    } else {
      Object.assign(this.data, data);
    }
    this.frmGroup.patchValue(this.data); // update with the current value
  }

  getData() {
    const dataKey = this.formProvider.getDataKey(),
      version = 'version',
      data = this.frmGroup.getRawValue(),
      newdata = new BaseModel();
    for (const key in data) {
      if (data[key] != null && data[key] !== this.data[key]) {
        newdata[key] = data[key];
      }
    }
    newdata[dataKey] = data[dataKey];
    newdata[version] = data.version;
    return newdata.serialize();
  }

  loading(show: boolean) {
    AppUtils.loading(show);
  }

  errorHandler(ex: any, errorMap: { [code: string]: string } = {}) {
    AppUtils.errorHandler(ex, errorMap);
  }

  applyItem(event: Event) {
    event.preventDefault();
  }

  deleteItem() {
    this.confirmationService.confirm({
      message: Locales.deleteRecord,
      accept: () => {
        this.doDelete();
      }
    });
  }

  doCancel() {
    this.formProvider.notify(EventType.Cancel, this.data);
  }
}
