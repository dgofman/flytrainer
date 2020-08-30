import Locales from '@locales/common';
import { OnInit, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseModel } from 'src/modules/models/base.model';
import { AppUtils } from '../../utils/app-utils';
import { FTFormControl } from '../../utils/ft-form.control';
import { FTTableFormProviderDirective } from './ft-table.component';

@Directive()
export abstract class AdminFormDirective implements OnInit {
  Locales = Locales;
  AppUtils = AppUtils;
  data: BaseModel;
  frmGroup: FormGroup;

  constructor(protected formProvider: FTTableFormProviderDirective) {
    const controls = {};
    formProvider.table.cols.forEach(col => {
        controls[col.field] = new FTFormControl(col, col.validators);
    });
    this.frmGroup = new FormGroup(controls);
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
      newdata = new BaseModel();
    this.formProvider.table.cols.forEach(col => {
      const control = this.frmGroup.get(col.field);
      const data = (control instanceof  FTFormControl) ? control.deserialize : control.value;
      if (data != null && data !== this.data[col.field]) {
        newdata[col.field] = data;
      }
    });
    newdata[dataKey] = this.data[dataKey];
    newdata[version] = this.data[version];
    return newdata;
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
