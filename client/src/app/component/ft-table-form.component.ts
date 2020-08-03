import {  OnInit, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {ConfirmationService} from 'primeng/api';
import { EventType, FTTableFormProviderDirective } from './ft-table.component';
import Locales from '@locales/common';

@Directive()
export abstract class AdminFormDirective implements OnInit {
  data: any;
  frmGroup: FormGroup;

  constructor(protected formProvider: FTTableFormProviderDirective, protected confirmationService: ConfirmationService) {
  }

  abstract doDelete(): void;

  ngOnInit(): void {
    this.data = this.formProvider.data;
    this.frmGroup.patchValue(this.data); // update with the current value
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
