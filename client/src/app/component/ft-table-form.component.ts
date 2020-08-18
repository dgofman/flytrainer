import Locales from '@locales/common';
import { OnInit, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppUtils } from '../utils/app-utils';
import { BaseModel } from 'src/modules/models/base.model';
import { FTFormControl } from '../utils/ft-form.control';
import { FTTableFormProviderDirective } from './ft-table.component';

@Directive()
export abstract class AdminFormDirective implements OnInit {
  Locales = Locales;
  AppUtils = AppUtils;
  data: BaseModel;
  frmGroup: FormGroup;

  constructor(protected formProvider: FTTableFormProviderDirective) {
  }

  get dataKey(): string {
    return this.formProvider.getDataKey();
  }

  isNew(item: BaseModel) {
    return this.formProvider.table.isNew(item);
  }

  ngOnInit(): void {
    this.setData(this.formProvider.data);
  }

  getLabel(field: string) {
    const control = this.frmGroup.get(field);
    return (control instanceof  FTFormControl) ? control.label : field;
  }

  setData(data: BaseModel) {
    if (!this.data) {
      this.data = data;
    } else {
      Object.assign(this.data, data);
    }
    this.frmGroup.patchValue(this.data); // update with the current value
  }

  getData() {
    const dataKey = this.dataKey,
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

  applyItem(event: Event): boolean {
    event.preventDefault();
    Object.keys(this.frmGroup.controls).forEach(field => {
      const control = this.frmGroup.get(field);
      if (!control.valid) {
        control.markAsDirty();
        Object.keys(control.errors).forEach(error => {
          let label = field;
          if (control instanceof  FTFormControl) {
            label = control.label;
          }
          AppUtils.showError(label, error, control.errors[error]);
        });
      }
    });
    return this.frmGroup.valid;
  }

  deleteItem() {
    const index = this.formProvider.table.data.indexOf(this.data);
    if (index !== -1) {
      this.formProvider.table.data.splice(index, 1);
    }
  }

  doCancel() {
    this.formProvider.table.onCancel(this.data);
  }
}
