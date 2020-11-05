import { FormControl, ValidatorFn, AbstractControlOptions } from '@angular/forms';
import { ColumnType } from 'src/modules/models/constants';
import { FTDatePipe, FTShortDatePipe, FTDateTimePipe, FTStatePipe } from './pipes';
import { BaseModel } from 'src/modules/models/base.model';

export class FTFormControl extends FormControl {

    constructor(public type: ColumnType, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions, formState?: any) {
        super(formState, validatorOrOpts);
    }

    get label(): string {
        return this.type.header;
    }

    static getData(col: ColumnType, rowData: BaseModel) {
        let data = rowData[col.field];
        if (data && col.path) {
            col.path.forEach(key => {
                data = data[key];
                if (!data) {
                    return false;
                }
            });
        }
        return data;
    }

    static Format(val: any, format: string): any {
        if (format === 'bool') {
            return '<i class="middle ' + new FTStatePipe().transform(val) + '"></i>';
        } else {
            return this.Serialize(val, format) || '';
        }
    }

    static Serialize(val: any, format: string): any {
        if (format && val !== null && typeof(val) !== 'boolean') {
            switch (format) {
                case 'date':
                    return new FTDatePipe().transform(val);
                case 'short':
                    return new FTShortDatePipe().transform(val);
                case 'datetime':
                    return new FTDateTimePipe().transform(val);
            }
        }
        return val;
    }
}
