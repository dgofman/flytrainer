import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, NgModule, HostBinding, ContentChildren, QueryList, Input, ViewEncapsulation, ViewChild, ElementRef, Inject } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { TabViewModule, TabView } from 'primeng/tabview';


@Component({
  selector: 'ft-dialog',
  template: `
      <div class="layout-mask" style="display: block"></div>
      <div class="modal">
        <div [style.width.em]="width" [style.height.em]="height" #dialog>
          <div class="breadcrumb">
            <span *ngFor="let label of breadcrumb">{{label}}</span>
          </div>
          <div class="resize pi" [class]="fullscreen? 'pi-window-minimize' : 'pi-window-maximize'" (click)="onFullScreen(!fullscreen)"></div>
          <div class="close pi pi-times" (click)="onFullScreen(false); show=false"></div>
          <p-tabView (onChange)="onTabChange($event.index)">
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
  path: string[];
  breadcrumb: string[];
  fullscreen: boolean;

  @ViewChild(TabView) tabView: TabView;
  @ViewChild('dialog') dialog: ElementRef;

  @HostBinding('style.display') display = 'none';
  @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;

  @Input('width') width: number;
  @Input('height') height: number;
  @Input('path') set labels(path: string[]) {
    this.breadcrumb = this.path = path;
    if (this.templates && this.templates.first) {
      this.breadcrumb = path.concat(this.templates.first.getType());
    }
  }

  constructor(@Inject(DOCUMENT) private document: any) {
  }

  set show(b: boolean) {
    this.display = b ? 'block' : 'none';
    this.fullscreen = false;
  }

  onFullScreen(state: boolean) {
    this.fullscreen = state;
    const elem = this.dialog.nativeElement,
      doc = this.document;
    if (this.fullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) { /* Firefox */
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) { /* IE/Edge */
        doc.msExitFullscreen();
      }
    }
  }

  onTabChange(index: number) {
    this.breadcrumb = this.path.concat(this.tabView.tabs[index].header);
  }
}

@NgModule({
  imports: [CommonModule, TabViewModule],
  exports: [FTDialogComponent],
  declarations: [FTDialogComponent]
})
export class FTDialogvModule {
}
