import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { Directive, Input, NgModule, EventEmitter, Output, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

export interface ColumnType {
  field: string;
  header: string;
  width?: number;
  format?: string;
}

export enum EventType {
  Load,
  Cancel
}

@Component({
  selector: 'ft-table',
  templateUrl: './ft-table.component.html'
})
export class FTTableComponent {
  @Input('expandFormTemplate') public expandFormTemplate: Component;
  @Input('columns') public columns: Array<ColumnType>;
  @Input('data') public data: Array<any>;
  @Input('dataKey') public dataKey: string;
  @Input('noData') public noData: string;
  @Output() public onNotify: EventEmitter<any> = new EventEmitter();

  newRow: any;
  expandedRows: {} = {};

  public itemsPerPageList: SelectItem[] = [
    { label: '15', value: 15 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: 'All', value: -1 }];
  public itemsPerPage = 25;
  public firstRow = 0;
  public tableVisible = true;

  sortDirection = 'asc';
  sortField = 'name';
  filterQuery: string;
  filterFieldName: string;

  notify(message: EventType, data: any) {
    this.onNotify.emit({ message, data });
  }

  lazyLoad(event: LazyLoadEvent) {
    this.sortField = event.sortField;
    this.sortDirection = event.sortField == null || event.sortOrder > 0 ? 'asc' : 'desc';
    this.expandedRows = {};
    this.notify(EventType.Load, event);
  }

  onAddNewRow() {
    if (this.newRow) {
      const index = this.data.indexOf(this.newRow);
      this.data.splice(index, 1);
      delete this.expandedRows[this.newRow.internalId];
    }
    this.newRow = {};
    this.newRow[this.dataKey] = -1;
    this.data.unshift(this.newRow);
    this.expandedRows[-1] = true;
  }

  itemsPerPageChanged() {
    this.firstRow = 0;
    this.lazyLoad({ sortField: 'name', sortOrder: 1, first: this.firstRow, rows: this.itemsPerPage });
  }

  formatData(col: any, rowData: any) {
    const data = rowData[col.field];
    switch (col.format) {
      case 'date':
        return new DatePipe('en-US').transform(data * 1000, 'medium');
      default:
        return data;
    }
  }

  childEventHandler(_: any) {

  }
}

@Directive({
  selector: '[ftTableFormProvider]'
})
export class FTTableFormProviderDirective {
  @Input('ftTableFormProvider') data: any;
  @Output() private onNotify: EventEmitter<any> = new EventEmitter();

  public notify(message: EventType, data: any) {
    this.onNotify.emit({ message, data });
  }
}

@NgModule({
  imports: [CommonModule, ButtonModule, TableModule],
  exports: [FTTableComponent, FTTableFormProviderDirective],
  declarations: [FTTableComponent, FTTableFormProviderDirective]
})
export class FTTableModule { }
