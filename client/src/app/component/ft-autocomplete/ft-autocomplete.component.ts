import { NgModule, Directive, HostListener, Input, DoCheck, Optional, AfterViewInit } from '@angular/core';
import { FormGroupDirective, NgControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoComplete } from 'primeng/autocomplete';
import Locales from '@locales/common';

@Directive({
    selector: '[ftAutoComplete]',
    host: {
        class: 'table-dropdown'
    }
})
export class FTAutoCompleteDirective implements DoCheck, AfterViewInit {

    @Input() data: any;
    @Input() dataField: string;
    @Input() field: string;
    @Input() placeholder: string;

    private selectedItem: any;
    private suggests: Array<any>;

    constructor(private ac: AutoComplete, @Optional() private control: NgControl, @Optional() private formGroup: FormGroupDirective) {
        ac.emptyMessage = Locales.noMatch;
        ac.placeholder = this.placeholder;
        ac.appendTo = 'body';
        ac.dropdown = true;
    }

    ngAfterViewInit(): void {
        if (!this.dataField && this.control) {
            this.dataField = String(this.control.name);
        }

        if (this.data instanceof Array) {
            this.suggests = this.data;
        } else {
            this.suggests = [];
            this.dataField = 'data';
            this.field = 'label';
            Object.keys(this.data || []).forEach(key => {
                const item = {label: this.data[key]};
                item[this.dataField] = key;
                this.suggests.push(item);
            });
            this.suggests.sort((a, b) => a.label.localeCompare(b.label));
        }

        this.ac.field = this.field;
        this.formGroup.valueChanges.subscribe(val => {
            this.valueChanges(val[this.control.name]);
        });
        const value = this.formGroup.form.value[this.control.name];
        if (value) {
            this.valueChanges(value);
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
        this.formGroup.form.value[this.control.name] = this.selectedItem ? this.selectedItem[this.dataField] : null;
        this.ac.inputEL.nativeElement.value = this.selectedItem ? this.selectedItem[this.field] : null;
    }

    ngDoCheck() {
        /* ALL EVENTS */
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
