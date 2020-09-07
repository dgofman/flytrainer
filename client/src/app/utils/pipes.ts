import {Pipe, PipeTransform, NgModule} from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';

@Pipe({name: 'ftepoch'})
export class FTEpochPipe implements PipeTransform {
  transform(seconds: number): Date {
    if (!seconds) {
      return null;
    }
    return new Date(seconds);
  }
}

@Pipe({name: 'ftdate'})
export class FTDatePipe implements PipeTransform {
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
  exports: [FTEpochPipe, FTDatePipe, FTDateTimePipe, FTStatePipe],
  declarations: [FTEpochPipe, FTDatePipe, FTDateTimePipe, FTStatePipe]
})
export class FTPipeModule { }
