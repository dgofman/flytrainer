import { Directive, Self, OnDestroy, NgModule, AfterViewInit, Input, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ColumnType } from 'src/modules/models/constants';
import { FTFormControl } from 'src/app/utils/ft-form.control';

@Directive({
  selector: '[ftFTFormatter]'
})
export class FTFormatterDirective implements AfterViewInit, OnDestroy {

  private destroy$ = new Subject();
  @Input() control: ColumnType;

  constructor(@Self() private ngControl: NgControl, private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    if (this.control && this.control.format) {
      this.ngControl
        .control
        .valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.updateValue.bind(this));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
