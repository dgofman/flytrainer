import Locales from '@locales/common';
import { LazyLoadEvent, SelectItem, PrimeTemplate } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Directive, Input, NgModule, EventEmitter, Output, Component, TemplateRef, AfterContentInit, ContentChildren, QueryList, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule, Table } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { BaseModel } from 'src/modules/models/base.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FTFormControl } from '../../utils/ft-form.control';
import { AppUtils } from '../../utils/app-utils';
import { DomHandler } from 'primeng/dom';
import { TableResult } from 'src/modules/models/table.result';
import { FTPipeModule } from 'src/app/utils/pipes';
import { ColumnType } from 'src/modules/models/constants';
import { EmitEvent, EventType } from 'src/services/event.service';
import { FTCalendarDirectiveModule } from '../ft-calendar/ft-calendar.component';

export type FTTableEvent = {
  first: number,
  total: number,
  sortField?: string,
  sortOrder?: string,
  filter?: {}
};

@Component({
  selector: 'ft-table',
  templateUrl: './ft-table.component.html',
  styleUrls: ['./ft-table.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class FTTableComponent implements AfterContentInit {
  Locales = Locales;
  isEditorAccess = AppUtils.isEditorAccess;
  yearRange = AppUtils.defaultYearRange;
  filterModel: FTTableEvent = { first: 0, total: 15 };
  firstHeaderTemplate: TemplateRef<any>;
  lastHeaderTemplate: TemplateRef<any>;
  firstColumnTemplate: TemplateRef<any>;
  lastColumnTemplate: TemplateRef<any>;
  expandFormTemplate: TemplateRef<any>;
  filters: { _saveFilter: false };
  filterGroup: FormGroup;
  firstRow = 0;
  total: number;

  @Input('columns') cols: ColumnType[];
  @Input('dataKey') public dataKey = 'id';
  @Input('data') public data: Array<BaseModel>;
  @Output() public onNotify: EventEmitter<EmitEvent> = new EventEmitter();
  @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;

  @Input('result') public set result(value: TableResult<BaseModel>) {
    if (value) {
      this.data = value.data;
      this.total = value.total;
      this.firstRow = value.first;
      this.table.first = this.firstRow;
    }
  }

  @Input('filter') public set filter(name: any) {
    this.filterName = name;
    this.filters = JSON.parse(sessionStorage.getItem(name) || '{"_saveFilter": true}');
    Object.keys(this.filters).forEach(key => {
      if (this.filters[key] instanceof Array) { // calendar range
        this.filters[key].forEach((val: any, index: number) => {
          if (typeof val === 'string') {
            this.filters[key][index] = new Date(val);
          }
        });
      }
    });
  }
  public get filter(): any {
    return this.filters;
  }

  newRow: BaseModel;
  expandedRows: {} = {};

  itemsPerPageList: SelectItem[] = [
    { label: '15', value: 15 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: 'All', value: -1 }];

  constructor() {
    this.filters = { _saveFilter: false };
  }

  private filterName: string;
  @ViewChild(Table) private table: Table;

  ngAfterContentInit(): void {
    const controls = { _saveFilter: new FTFormControl({ field: '_saveFilter' }) };
    this.cols.forEach(col => {
      controls[col.field] = new FTFormControl(col);
      controls[col.field + '_show'] = new FTFormControl(col);
      if (col.show !== 'never') {
        if (this.filters[col.field + '_show'] !== undefined) {
          col.show = this.filters[col.field + '_show'] === true;
        }
        this.filters[col.field + '_show'] = col.show;
      }
    });
    this.filterGroup = new FormGroup(controls);
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'firstColumn':
          this.firstColumnTemplate = item.template;
          break;
        case 'lastColumn':
          this.lastColumnTemplate = item.template;
          break;
        case 'firstHeader':
          this.firstHeaderTemplate = item.template;
          break;
        case 'lastHeader':
          this.lastHeaderTemplate = item.template;
          break;
        case 'expandForm':
          this.expandFormTemplate = item.template;
          break;
      }
    });
    this.resetFilter();
  }

  resetFilter() {
    this.filterGroup.reset();
    this.filterGroup.patchValue(this.filters);
  }

  clearFilter() {
    this.filterGroup.reset();
  }

  saveFilter() {
    if (this.filterName) {
      sessionStorage.setItem(this.filterName, JSON.stringify(this.filter));
    }
  }

  applyFilter() {
    const data = this.filterGroup.value;
    this.cols.forEach(col => {
      if (col.show !== 'never') {
        col.show = data[col.field + '_show'] === true;
      }
    });
    for (const name in data) {
      if (data[name] === null || data[name] === undefined) {
        delete data[name];
      }
    }
    if (data._saveFilter) {
      this.filters = data;
    }
    this.filters._saveFilter = data._saveFilter;
    if (data._saveFilter) {
      this.saveFilter();
    }
    this.table.tableService.onColumnsChange(this.cols);
    this.firstRow = 0;
    this.lazyLoad();
  }

  getColumns(view: number): Array<ColumnType> {
    if (view === 0) {
      return this.cols.filter(c => c.show === true);
    } else if (view === 1) {
      return this.cols.filter(c => c.show !== 'never');
    } else {
      return this.cols.filter(c => this.filterGroup.get(c.field).value !== null);
    }
  }

  getChips(col: ColumnType) {
    const val = this.filterGroup.get(col.field).value;
    if (val instanceof Array) { // calendar range
      const dates = [];
      val.forEach(date => {
        if (date instanceof Date) {
          dates.push(new DatePipe('en-US').transform(date, 'shortDate'));
        }
      });
      return dates.join(' - ');
    } else if (typeof val === 'boolean') {
        return val ? Locales.yes : Locales.no;
    }
    return val;
  }

  removeChip(col: ColumnType) {
    this.filterGroup.get(col.field).setValue(null);
    this.applyFilter();
  }

  notify(message: EventType, data: any) {
    this.onNotify.emit({ message, data } as EmitEvent);
  }

  itemsPerPageChanged(event: any) {
    this.lazyLoad({ first: 0, rows: event.value });
  }

  lazyLoad(event?: LazyLoadEvent) {
    if (event) {
      this.firstRow = event.first;
      this.filterModel.total = event.rows;
      if (event.sortField) {
        this.filterModel.sortField = event.sortField;
        this.filterModel.sortOrder = event.sortOrder > 0 ? 'asc' : 'desc';
      }
    }
    this.expandedRows = {};
    this.filterModel.first = this.firstRow;
    this.filterModel.filter = this.filter;
    this.refresh();
  }

  refresh() {
    this.notify(EventType.Load, this.filterModel);
  }

  colResize() {
    const headers = DomHandler.find(this.table.containerViewChild.nativeElement, '.ui-table-thead > tr:first-child > th');
    headers.map(header => {
      delete this.filters[header.id + '_width'];
      const width = DomHandler.getOuterWidth(header);
      const col = this.filterGroup.get(header.id) as FTFormControl;
      if (col && col.type.width && col.type.width !== width) {
        this.filters[header.id + '_width'] = width;
      }
    });
    this.saveFilter();
  }

  onExpandCollapse(event: any, isExpand: boolean) {
    this.notify(isExpand ? EventType.Expand : EventType.Collapse, event.data);
  }

  onAddNewRow() {
    if (this.newRow) {
      const index = this.data.indexOf(this.newRow);
      this.data.splice(index, 1);
      delete this.expandedRows[this.newRow[this.dataKey]];
    }
    this.data.unshift(new BaseModel());
    this.newRow = this.data[0];
    this.newRow[this.dataKey] = -1;
    this.expandedRows[this.newRow[this.dataKey]] = true;
    this.notify(EventType.New, this.newRow);
  }

  isNew(item: BaseModel) {
    return item[this.dataKey] === -1;
  }

  formatColData(col: ColumnType, rowData: BaseModel, title: boolean) {
    const val = FTFormControl.getData(col, rowData);
    if (title && col.format === 'bool') {
      return val ? Locales.yes : Locales.no;
    } else if (col.type === 'popup' && col.value) {
      for (const opt of col.value) {
        if (opt.value === val) {
          return opt.label;
        }
      }
    }
    return FTFormControl.Format(val, col.format);
  }

  onCancel(item: BaseModel) {
    if (this.newRow) {
      delete this.expandedRows[this.newRow[this.dataKey]];
      if (this.isNew(item)) {
        this.data.splice(0, 1);
      }
      this.newRow = null;
    } else {
      delete this.expandedRows[item[this.dataKey]];
    }
  }

  exportPdf() {
    /*import('jspdf').then(jspdf => {
      import('jspdf-autotable').then(_  => {
        const doc = new jspdf.jsPDF() as any;
        doc.text(new Date().toLocaleString(), 15, 10);
        doc.autoTable({
          head: [this.getColumns(0).map(c => c.header)],
          body: this.data.map(rowData => this.getColumns(0).map(col => this.formatColData(col, rowData, true)))
        });
        doc.save('flytrainer.pdf');
      });
    });*/
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      const columns = this.getColumns(0);
      const wscols = [];
      const order = [];
      const data = [];
      columns.forEach(col => {
        order.push(col.header);
        wscols.push({ width: (this.filters[col.field + '_width'] || col.width || 0) / 5 });
      });
      this.data.forEach(row => {
        const cols = {};
        columns.forEach(col => {
          cols[col.header] = this.formatColData(col, row, true);
        });
        data.push(cols);
      });
      const worksheet = xlsx.utils.json_to_sheet(data, { header: order });
      worksheet['!cols'] = wscols;
      const workbook = { Sheets: { Data: worksheet }, SheetNames: ['Data'] };
      xlsx.writeFile(workbook, 'flytrainer.xlsx', { bookType: 'xlsx', type: 'array' });
    });
  }
}

@Directive({
  selector: '[ftTableFormProvider]'
})
export class FTTableFormProviderDirective {
  @Input('table') table: FTTableComponent;
  @Input('ftTableFormProvider') data: BaseModel;

  public getDataKey() {
    return this.table.dataKey;
  }
}

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, TooltipModule, CheckboxModule, RadioButtonModule, DropdownModule,
    CalendarModule, InputNumberModule, TableModule, OverlayPanelModule, FTPipeModule, FTCalendarDirectiveModule],
  exports: [FTTableComponent, FTTableFormProviderDirective],
  declarations: [FTTableComponent, FTTableFormProviderDirective]
})
export class FTTableModule { }
