import Locales from '@locales/common';
import { OnInit, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AppUtils } from '../utils/app-utils';
import { EventType, FTTableFormProviderDirective } from './ft-table.component';

@Directive()
export abstract class AdminFormDirective implements OnInit {
  AppUtils = AppUtils;
  data: any;
  frmGroup: FormGroup;

  constructor(protected formProvider: FTTableFormProviderDirective, protected confirmationService: ConfirmationService) {
  }

  abstract doDelete(): void;

  ngOnInit(): void {
    this.init(this.formProvider.data);
  }

  init(data: any) {
    this.data = data;
    this.frmGroup.patchValue(this.data); // update with the current value
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

  deleteItem(event: Event) {
    event.preventDefault();
    this.confirmationService.confirm({
      message: Locales.deleteRecord,
      accept: () => {
        this.doDelete();
      }
    });
  }

  cancelItem(event: Event) {
    event.preventDefault();
    this.formProvider.notify(EventType.Cancel, this.data);
  }
}
