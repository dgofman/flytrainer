import {Pipe, PipeTransform, NgModule} from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';

@Pipe({name: 'ftdate'})
export class FTDatePipe implements PipeTransform {
  transform(seconds: number): string {
    if (!seconds) {
      return '';
    }
    return new DatePipe('en-US').transform(seconds, 'mediumDate');
  }
}

@Pipe({name: 'ftshortdate'})
export class FTShortDatePipe implements PipeTransform {
  transform(seconds: number): string {
    if (!seconds) {
      return '';
    }
    return new DatePipe('en-US').transform(seconds, 'short');
  }
}

@Pipe({name: 'ftdatetime'})
export class FTDateTimePipe implements PipeTransform {
  transform(seconds: number): string {
    if (!seconds) {
      return '';
    }
    return new DatePipe('en-US').transform(seconds, 'medium');
  }
}

@Pipe({name: 'ftstate'})
export class FTStatePipe implements PipeTransform {
  transform(state: boolean): string {
    return 'pi ' + (state ? 'pi-circle-on green' : 'pi-circle-on red');
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [FTDatePipe, FTShortDatePipe, FTDateTimePipe, FTStatePipe],
  declarations: [FTDatePipe, FTShortDatePipe, FTDateTimePipe, FTStatePipe]
})
export class FTPipeModule { }
