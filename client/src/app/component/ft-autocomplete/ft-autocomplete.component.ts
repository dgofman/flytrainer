import { NgModule, Directive, HostListener, Input, DoCheck, Optional, OnInit } from '@angular/core';
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
export class FTAutoCompleteDirective implements DoCheck, OnInit {

    @Input() data: any;
    @Input() dataField: string;
    @Input() field: string;
    @Input() placeholder: string;

    private formControls: any;
    private selectedItem: any;
    private suggests: Array<any>;

    constructor(private ac: AutoComplete, @Optional() private control: NgControl, @Optional() private formGroup: FormGroupDirective) {
        ac.emptyMessage = Locales.noMatch;
        ac.placeholder = this.placeholder;
        ac.appendTo = 'body';
        ac.dropdown = true;
    }

    ngOnInit(): void {
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

        if (this.formGroup) {
            this.formGroup.valueChanges.subscribe(value => {
                    const data = value[this.control.name];
                    this.formControls = value;
                    this.suggests.forEach(e => {
                        if (e[this.field] === data || e[this.dataField] === data) {
                            this.selectedItem = e;
                            this.ac.inputEL.nativeElement.value = this.selectedItem ? this.selectedItem[this.field] : null;
                            return;
                        }
                        this.formControls[this.control.name] = this.selectedItem ? this.selectedItem[this.dataField] : null;
                    });
                }
            );
        }
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
        this.formControls[this.control.name] = this.selectedItem ? this.selectedItem[this.dataField] : null;
        this.ac.inputEL.nativeElement.value = this.selectedItem ? this.selectedItem[this.field] : null;
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [FTAutoCompleteDirective],
    declarations: [FTAutoCompleteDirective]
})
export class FTAutoCompleteModule { }
