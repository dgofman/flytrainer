import Locales from '@locales/common';
import { LazyLoadEvent, SelectItem, PrimeTemplate } from 'primeng/api';
import { OverlayPanelModule} from 'primeng/overlaypanel';
import { Directive, Input, NgModule, EventEmitter, Output, Component, TemplateRef, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import {TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { AppUtils } from '../utils/app-utils';
import { BaseModel } from 'src/modules/models/base.model';
import { DropdownModule } from 'primeng/dropdown';
import { AbstractControlOptions, ValidatorFn, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FTFormControl } from '../utils/ft-form.control';

type SHOW_COLUMNS = 'never' | 'default';
type FORMAT_COLUMNS = 'date' | 'datetime' | 'epoch' | 'bool';
type TYPET_COLUMNS = 'check' | 'cal' | 'radio' | 'input' | 'disable' | 'popup';

export enum EventType {
  Load,
  New
}

export interface EmitEvent {
  message: EventType;
  data: any;
}

export interface ColumnType {
  field: string;
  header?: string;
  width?: number;
  align?: string;
  validators?: ValidatorFn | ValidatorFn[] | AbstractControlOptions;
  format?: FORMAT_COLUMNS;
  show?: SHOW_COLUMNS;
  type?: TYPET_COLUMNS;
  value?: any;
}

@Component({
  selector: 'ft-table',
  templateUrl: './ft-table.component.html',
  styleUrls: ['./ft-table.component.less']
})
export class FTTableComponent implements AfterContentInit {
  Locales = Locales;
  isEditorAccess = AppUtils.isEditorAccess;
  yearRange = AppUtils.defaultYearRange;
  lastColumnTemplate: TemplateRef<any>;
  filters: {_saveFilter: false};
  filterGroup: FormGroup;

  @Input('columns') cols: ColumnType[];
  @Input('expandFormTemplate') public expandFormTemplate: Component;
  @Input('dataKey') public dataKey = 'id';
  @Input('data') public data: Array<BaseModel>;
  @Input('sortField') public sortField: string;
  @Output() public onNotify: EventEmitter<EmitEvent> = new EventEmitter();
  @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;

  @Input('filter') public set filter(name: any) {
    this.filters = JSON.parse(sessionStorage.getItem(name) || '{}');
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

  itemsPerPage = 25;
  firstRow = 0;
  sortDirection = 'asc';
  filterColumn: string;
  filterQuery: string;

  ngAfterContentInit(): void {
    const controls = {_saveFilter: new FTFormControl({field: '_saveFilter'})};
    this.cols.forEach(col => {
        controls[col.field] = new FTFormControl(col);
        controls[col.field + '_show'] = new FTFormControl(col);
        if (col.show === 'default') {
          this.filters[col.field + '_show'] = true;
        }
    });
    this.filterGroup = new FormGroup(controls);
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'lastColumn':
            this.lastColumnTemplate = item.template;
            break;
      }
    });
  }

  resetFilter() {
    this.filterGroup.reset();
    this.filterGroup.patchValue(this.filters);
  }

  clearFilter() {
    this.filterGroup.reset();
  }

  applyFilter() {
    const data = this.filterGroup.getRawValue();
    for (const name in data) {
      if (!data[name] && data[name] !== 0) {
        delete data[name];
      }
    }
    if (data._saveFilter) {
      this.filters = data;
    }
    this.filters._saveFilter = data._saveFilter;
  }

  public getColumns(all: boolean): Array<ColumnType> {
    if (all) {
        return this.cols.filter(c => c.show !== 'never');
    } else {
        return this.cols.filter(c => this.isShow(c));
    }
  }

  isShow(c: ColumnType) {
    return this.getFilter(c.field + '_show') && c.show === 'default';
  }

  getFilter(name: string) {
    return this.filters[name] || {};
  }

  notify(message: EventType, data: any) {
    this.onNotify.emit({ message, data } as EmitEvent);
  }

  itemsPerPageChanged() {
    this.firstRow = 0;
    this.lazyLoad({ sortField: this.dataKey, sortOrder: 1, first: this.firstRow, rows: this.itemsPerPage });
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
    this.data.unshift(new BaseModel());
    this.newRow = this.data[0];
    this.newRow[this.dataKey] = -1;
    this.expandedRows[this.newRow[this.dataKey]] = true;
    this.notify(EventType.New, this.newRow);
  }

  isNew(item: BaseModel) {
    return item[this.dataKey] === -1;
  }

  formatData(col: any, rowData: BaseModel, title: boolean) {
    const data = rowData[col.field];
    switch (col.format) {
      case 'bool':
        return title ? '' : '<i class="pi ' + (data ? 'pi-thumbs-up green' : 'pi-thumbs-down red') + '"></i>';
      default:
        return FTFormControl.Serialize(data, col.format);
    }
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
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, TooltipModule, CheckboxModule,  DropdownModule, CalendarModule, TableModule, OverlayPanelModule],
  exports: [FTTableComponent, FTTableFormProviderDirective],
  declarations: [FTTableComponent, FTTableFormProviderDirective]
})
export class FTTableModule { }
