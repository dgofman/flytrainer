import {Pipe, PipeTransform, NgModule} from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';

@Pipe({name: 'ftdate'})
export class FTDatePipe implements PipeTransform {
  transform(value: any): string {
    return new DatePipe('en-US').transform(value, 'mediumDate');
  }
}

@Pipe({name: 'ftshortdate'})
export class FTShortDatePipe implements PipeTransform {
  transform(value: any): string {
    return new DatePipe('en-US').transform(value, 'shortDate');
  }
}

@Pipe({name: 'ftdatetime'})
export class FTDateTimePipe implements PipeTransform {
  transform(value: any): string {
    return new DatePipe('en-US').transform(value, 'medium');
  }
}

@Pipe({name: 'ftstate'})
export class FTStatePipe implements PipeTransform {
  transform(state: boolean): string {
    return 'pi ' + (state ? 'pi-check-circle green' : 'pi-ban red');
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [FTDatePipe, FTShortDatePipe, FTDateTimePipe, FTStatePipe],
  declarations: [FTDatePipe, FTShortDatePipe, FTDateTimePipe, FTStatePipe]
})
export class FTPipeModule { }
