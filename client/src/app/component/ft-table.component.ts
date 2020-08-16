import Locales from '@locales/common';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { Directive, Input, NgModule, EventEmitter, Output, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FTDatePipe } from '../utils/pipes';
import { AppUtils } from '../utils/app-utils';
import { BaseModel } from 'src/modules/models/base.model';
import { DropdownModule } from 'primeng/dropdown';

export interface ColumnType {
  field: string;
  header: string;
  width?: number;
  format?: string;
  align?: string;
}

export interface EmitEvent {
  message: EventType;
  data: any;
}

export enum EventType {
  Load,
  Cancel
}

@Component({
  selector: 'ft-table',
  templateUrl: './ft-table.component.html',
  styleUrls: ['./ft-table.component.less']
})
export class FTTableComponent {
  Locales = Locales;
  isEditorAccess = AppUtils.isEditorAccess;

  @Input('expandFormTemplate') public expandFormTemplate: Component;
  @Input('columns') public columns: Array<ColumnType>;
  @Input('dataKey') public dataKey = 'id';
  @Input('data') public data: Array<BaseModel>;
  @Input('noData') public noData: string;
  @Input('sortField') public sortField: string;
  @Output() public onNotify: EventEmitter<any> = new EventEmitter();

  newRow: any;
  expandedRows: {} = {};

  itemsPerPageList: SelectItem[] = [
    { label: '15', value: 15 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: 'All', value: -1 }];

  itemsPerPage = 25;
  firstRow = 0;
  sortDirection = 'asc';
  filterColumn: string;
  filterQuery: string;

  notify(message: EventType, data: any) {
    this.onNotify.emit({ message, data } as EmitEvent);
  }

  itemsPerPageChanged() {
    this.firstRow = 0;
    this.lazyLoad({ sortField: 'id', sortOrder: 1, first: this.firstRow, rows: this.itemsPerPage });
  }

  lazyLoad(event: LazyLoadEvent) {
    if (event.sortField) {
      this.sortField = event.sortField;
      this.sortDirection = event.sortOrder > 0 ? 'asc' : 'desc';
    }
    this.expandedRows = {};
    this.notify(EventType.Load, this);
  }

  onAddNewRow() {
    if (this.newRow) {
      const index = this.data.indexOf(this.newRow);
      this.data.splice(index, 1);
      delete this.expandedRows[this.newRow[this.dataKey]];
    }
    this.newRow = {};
    this.newRow[this.dataKey] = -1;
    this.data.unshift(this.newRow);
    this.expandedRows[this.newRow[this.dataKey]] = true;
  }

  onMoreDetails() {

  }

  formatData(col: any, rowData: any, title: boolean) {
    const data = rowData[col.field];
    switch (col.format) {
      case 'date':
        return new FTDatePipe().transform(data);
      case 'bool':
        return title ? '' : '<i class="pi ' + (data ? 'pi-thumbs-up green' : 'pi-thumbs-down red') + '"></i>';
      default:
        return data;
    }
  }

  onCancel(item: BaseModel) {
    delete this.expandedRows[item.id];
    if (item.id === -1) {
      this.data.splice(0, 1);
      this.newRow = null;
    }
  }

  formEventHandler(event: EmitEvent) {
    switch (event.message) {
      case EventType.Cancel:
        this.onCancel(event.data);
    }
  }
}

@Directive({
  selector: '[ftTableFormProvider]'
})
export class FTTableFormProviderDirective {
  @Input('table') table: FTTableComponent;
  @Input('ftTableFormProvider') data: BaseModel;
  @Output() private onNotify: EventEmitter<any> = new EventEmitter();

  public notify(message: EventType, data: any) {
    this.onNotify.emit({ message, data } as EmitEvent);
  }

  public getDataKey() {
    return this.table ? this.table.dataKey : 'id';
  }
}

@NgModule({
  imports: [CommonModule, ButtonModule, DropdownModule, TableModule],
  exports: [FTTableComponent, FTTableFormProviderDirective],
  declarations: [FTTableComponent, FTTableFormProviderDirective]
})
export class FTTableModule { }
