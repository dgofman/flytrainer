import { Directive, Host, Self, HostListener, NgModule, Input } from '@angular/core';
import { CalendarModule, Calendar } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { AppUtils } from 'src/app/utils/app-utils';

@Directive({
    selector: '[ftCalendar]',
})
export class FTCalendarDirective {

    @Input() set showTime(show: boolean) {
        this.calendar.showTime = show;
    }

    constructor(@Host() @Self() private calendar: Calendar) {
        if (!calendar.placeholder) {
            calendar.placeholder = 'mm/dd/yyyy';
        }
        calendar.monthNavigator = true;
        calendar.yearNavigator = true;
        calendar.showButtonBar = true;
        calendar.showIcon = true;
        calendar.hourFormat = '24';
        calendar.appendTo = 'body';
        calendar.yearRange = AppUtils.defaultYearRange;
        calendar.defaultDate = new Date();
        calendar.defaultDate.setHours(0);
        calendar.defaultDate.setMinutes(0);

        calendar.parseDateTime = (text) => {
            return new Date(text);
        };
     }

    @HostListener('onSelect', ['$event']) onSelect() {
        this.updateTime();
    }

    @HostListener('onInput', ['$event']) onInput() {
        this.updateTime();
    }

    updateTime() {
        /*if (this.calendar.showTime) {
            const now = new Date();
            this.calendar.value.setHours(now.getHours());
            this.calendar.value.setMinutes(now.getMinutes());
            this.calendar.updateModel(this.calendar.value);
        }*/
    }
}

@NgModule({
    imports: [CommonModule, CalendarModule],
    exports: [FTCalendarDirective],
    declarations: [FTCalendarDirective]
})
export class FTCalendarDirectiveModule { }
