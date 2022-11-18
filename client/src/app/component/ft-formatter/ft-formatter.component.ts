import { Directive, Self, OnDestroy, NgModule, AfterViewInit, Input, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ColumnType } from 'src/modules/models/constants';
import { FTFormControl } from 'src/app/utils/ft-form.control';

@Directive({
    selector: '[ftFTFormatter]'
})
export class FTFormatterDirective implements AfterViewInit, OnDestroy {

    subs: Subscription;
    @Input() control: ColumnType;

    constructor(@Self() private ngControl: NgControl, private elementRef: ElementRef) {
        this.subs = new Subscription();
    }

    ngAfterViewInit() {
        if (this.control && this.control.format) {
            this.subs.add(this.ngControl
                .control
                .valueChanges
                .subscribe(this.updateValue.bind(this)));
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    updateValue(value: any) {
        this.elementRef.nativeElement.value = FTFormControl.Serialize(value, this.control.format);
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [FTFormatterDirective],
    declarations: [FTFormatterDirective]
})
export class FTFormatterDirectiveModule { }
