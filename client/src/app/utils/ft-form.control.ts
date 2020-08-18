import { FormControl, ValidatorFn, AbstractControlOptions } from '@angular/forms';

export class FTFormControl extends FormControl {

    constructor(public label: string, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions, formState?: any) {
        super(formState, validatorOrOpts);
    }
}
