import {Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({name: 'ftdate'})
export class FTDatePipe implements PipeTransform {
  transform(seconds: number): string {
    if (!seconds) {
      return '';
    }
    return new DatePipe('en-US').transform(seconds * 1000, 'medium');
  }
}
