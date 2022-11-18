import Locales from '@locales/common';
import { environment } from '@client/environments/environment';
import { Component, NgModule, ElementRef, Renderer2, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <router-outlet name="view"></router-outlet>
    <app-toast></app-toast>
    <app-overlay></app-overlay>`
})
export class AppComponent {

  constructor(provider: Title) {
    provider.setTitle(environment.company);
  }
}

@Component({
  selector: 'app-overlay',
  host: { class: 'ui-dialog-mask ui-widget-overlay' },
  template: `<div class="app-loading"></div>`
})
export class AppOverlayComponent {
  static el: ElementRef;

  constructor(hostElement: ElementRef) {
    AppOverlayComponent.el = hostElement;
  }
}

@Component({
  selector: 'app-toast',
  host: { class: 'app-toast' },
  template: ``,
  styles: [
    `
      div {
        position: relative;
        margin-bottom: 10px;
        box-shadow: 5px 5px 10px #999;
      }
      p {
        padding: 15px 20px 2px;
      }
      i {
        font-size: 1.5rem;
        margin: 0 10px 5px 0;
      }
      span {
        vertical-align: top;
        line-height: 25px;
      }
      .close {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-pack: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
      }
      .close:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      .error {
        background: #FFCDD2;
        border: solid #e60017;
        border-width: 0 0 0 6px;
        color: #73000c;
      }
      .success {
        background: #C8E6C9;
        border: solid #439446;
        border-width: 0 0 0 6px;
        color: #224a23;
      }
    `
  ]
})
export class AppToastComponent {
  static el: ElementRef;
  static renderer: Renderer2;

  constructor(hostElement: ElementRef, renderer: Renderer2) {
    AppToastComponent.el = hostElement;
    AppToastComponent.renderer = renderer;
  }

  static add(className: string, message: string): any {
    const r = AppToastComponent.renderer,
      div = r.createElement('div'),
      p = r.createElement('p'),
      close = r.createElement('span'),
      i = r.createElement('i'),
      span = r.createElement('span');
    div.className = className;
    close.className = 'pi pi-times close';
    i.className = 'pi pi-check';
    span.innerHTML = `<b>${Locales.success}</b><br>${message}</p>`;
    if (className === 'error') {
      i.className = 'pi pi-times-circle';
      span.innerHTML = `<b>${Locales.error}</b><br>${message}</p>`;
    }
    r.appendChild(p, close);
    r.appendChild(p, i);
    r.appendChild(p, span);
    r.appendChild(div, p);
    r.appendChild(this.el.nativeElement, div);
    r.listen(close, 'click', () => {
      r.removeChild(this.el.nativeElement, div);
    });
    setTimeout(() => {
      if (r.parentNode(div)) {
        r.removeChild(this.el.nativeElement, div);
      }
    }, 5000);
  }
}

@Component({
  selector: 'app-header',
  template: `
  <div>
      <h3>{{environment.company}}</h3>
      <h4>{{environment.phone}}</h4>
      <div [class]="toggleArrowMenu ? 'arrow-menu open' : 'arrow-menu'" (click)="toggleArrowMenu = !toggleArrowMenu;" *ngIf="showArrow">
        <i class="pi pi-chevron-circle-right"></i>
      </div>
    </div>
  `,
  styles: [`
      .arrow-menu {
        cursor: pointer;
        position: absolute;
        top: 15px;
        right: -15px;
        font-size: 25px;
        z-index: 1;
      }
      .arrow-menu:hover {
        color: #d8dae2;
      }

      .arrow-menu>i {
        -moz-transition: all 0.3s;
        -o-transition: all 0.3s;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
      }

      .arrow-menu.open>i {
          -webkit-transform: rotate(-180deg);
          -moz-transform: rotate(-180deg);
          -o-transform: rotate(-180deg);
          -ms-transform: rotate(-180deg);
          transform: rotate(-180deg);
      }
    `]
})
export class AppHeaderComponent {
  private static toggle = true;
  environment = environment;

  @Input('showArrow') showArrow = true;

  set toggleArrowMenu(state: boolean) {
    AppHeaderComponent.toggle = state;
  }
  get toggleArrowMenu(): boolean {
    return AppHeaderComponent.toggle;
  }
  public static get toggleArrowMenu(): boolean {
    return AppHeaderComponent.toggle;
  }

  public static set toggleArrowMenu(state: boolean) {
    AppHeaderComponent.toggle = state;
  }
}

@Component({
  selector: 'app-footer',
  template: `<a [href]="tfrLink" target="_blank">TFR</a>&nbsp;|&nbsp;
            <a [href]="wxbriefLink" target="_blank">1800WXBrief</a>&nbsp;|&nbsp;
            <a [href]="wxLink" target="_blank">AviationWeather</a>&nbsp;|&nbsp;
            <a [href]="iplanLink" target="_blank">iFlightPlanner</a>&nbsp;|&nbsp;
            <a [href]="skyvectorLink" target="_blank">Skyvector</a>
            <div class="powerby">${Locales.powerBy}</div>`
})
export class AppFooterComponent {
  tfrLink = environment.tfrLink || 'https://tfr.faa.gov/tfr2/list.jsp';
  wxbriefLink = environment.wxbriefLink || 'https://www.1800wxbrief.com/Website/weatherGraphics?conus=0';
  wxLink = environment.wxLink || 'https://www.aviationweather.gov';
  iplanLink = environment.iplanLink || 'https://www.iFlightPlanner.com/AviationCharts/?Map=sectional&GS=115&Route=' + environment.homeAirport;
  skyvectorLink = environment.skyvectorLink || 'https://skyvector.com/';
}

@NgModule({
  imports: [CommonModule],
  exports: [AppHeaderComponent, AppFooterComponent],
  declarations: [AppHeaderComponent, AppFooterComponent]
})
export class AppComponentModule {
}
