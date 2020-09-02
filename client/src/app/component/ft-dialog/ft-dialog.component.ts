import { CommonModule } from '@angular/common';
import { Component, NgModule, HostBinding, ContentChildren, QueryList, Input, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';


@Component({
    selector: 'ft-dialog',
    template: `
      <div class="layout-mask" style="display: block"></div>
      <div class="modal">
        <div [style.width.em]="width" [style.height.em]="height">
          <div class="breadcrumb">
            <span *ngFor="let label of labels">{{label}}</span>
          </div>
          <div class="close pi pi-times" (click)="show=false"></div>
          <p-tabView>
              <p-tabPanel [header]="item.getType()" *ngFor="let item of this.templates; let i = index" [selected]="i == 0">
                <ng-container *ngTemplateOutlet="item.template"></ng-container>
              </p-tabPanel>
          </p-tabView>
        </div>
      </div>
    `,
    styleUrls: ['./ft-dialog.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class FTDialogComponent {
  @HostBinding('style.display') display = 'none';
  @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;

  @Input('width') width: number;
  @Input('height') height: number;
  @Input('labels') labels: string[];

  set show(b: boolean) {
    this.display = b ? 'block' : 'none';
  }
}

@NgModule({
  imports: [CommonModule, TabViewModule],
  exports: [FTDialogComponent],
  declarations: [FTDialogComponent]
})
export class FTDialogvModule {
}
