import { NgModule, Directive, HostListener, Input, Optional, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroupDirective, NgControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoComplete } from 'primeng/autocomplete';
import Locales from '@locales/common';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[ftAutoComplete]',
    host: {
        class: 'table-dropdown'
    }
})
export class FTAutoCompleteDirective implements AfterViewInit, OnDestroy {

    @Input() dataField: string;
    @Input() field: string;
    @Input() placeholder: string;

    private items: any;
    private displayValue: string;
    private selectedItem: any;
    private suggests: Array<any>;
    private formGroupSubscription: Subscription;

    constructor(private ac: AutoComplete, @Optional() private control: NgControl, @Optional() private formGroup: FormGroupDirective) {
        ac.emptyMessage = Locales.noData;
        ac.placeholder = this.placeholder;
        ac.appendTo = 'body';
        ac.dropdown = true;
        this.displayValue = null;
        this.dataField = 'data';
        this.field = 'label';
    }

    ngAfterViewInit(): void {
        this.updateValue();
    }

    @Input() set data(data: any) {
        this.items = data;
        if (data instanceof Array) {
            this.suggests = data;
        } else {
            this.suggests = [];
            Object.keys(data || []).forEach(key => {
                const item = { label: data[key] };
                item[this.dataField] = key;
                this.suggests.push(item);
            });
            this.suggests.sort((a, b) => a.label.localeCompare(b.label));
        }

        this.ac.field = this.field;
        this.formGroupSubscription = this.formGroup.valueChanges.subscribe(val => {
            if (this.control) {
                this.valueChanges(val[this.control.name]);
            }
        });
        if (this.control) {
            const value = this.formGroup.form.value[this.control.name];
            if (value) {
                this.valueChanges(value);
            }
        }
    }

    get data() {
        return this.items;
    }

    ngOnDestroy() {
        if (this.formGroupSubscription) {
            this.formGroupSubscription.unsubscribe();
        }
    }

    valueChanges(data: any) {
        this.suggests.forEach(e => {
            if (e[this.field] === data || e[this.dataField] === data || (data instanceof Object && e[this.dataField] === data[this.dataField])) {
                this.selectedItem = e;
                this.updateValue();
                return false;
            }
        });
    }

    updateValue() {
        if (this.control) {
            this.formGroup.form.value[this.control.name] = this.selectedItem ? this.selectedItem[this.dataField] : null;
        }
        this.displayValue = this.selectedItem ? this.selectedItem[this.field] : null;
        if (this.ac.inputEL) {
            this.ac.inputEL.nativeElement.value = this.displayValue;
        }
    }

    @HostListener('completeMethod', ['$event'])
    onCompleteMethod(emit: any) {
        if (this.suggests) {
            const isstr = [],
                startwith = [],
                query = emit.query.toLowerCase();
            this.suggests.forEach(e => {
                const index = String(e[this.field]).toLowerCase().indexOf(query);
                if (index === 0) {
                    startwith.push(e);
                } else if (index !== -1) {
                    isstr.push(e);
                }
            });
            this.ac.suggestions = startwith.concat(isstr);
        }
    }

    @HostListener('onSelect', ['$event'])
    @HostListener('onHide')
    onChangeHandler(option?: any) {
        if (!option && this.ac.suggestions && this.ac.inputEL.nativeElement.value !== '') { // OnHide
            const arr = (this.ac.suggestions.filter(e => e[this.field].toLowerCase().indexOf(this.ac.inputEL.nativeElement.value.toLowerCase()) === 0));
            if (arr.length) {
                this.selectedItem = arr[0]; // pick first value
            }
        } else {
            this.selectedItem = option;
        }
        this.updateValue();
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [FTAutoCompleteDirective],
    declarations: [FTAutoCompleteDirective]
})
export class FTAutoCompleteModule { }
