import Locales from '@locales/common';
import { environment } from '@client/environments/environment';
import { Component, NgModule, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
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
    if (className === 'error') {
      i.className = 'pi pi-times-circle';
    }
    span.innerHTML = `<b>${Locales.error}</b><br>${message}</p>`;
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
    }, 3000);
  }
}

@Component({
  selector: 'app-footer',
  template: `<a [href]="tfrLink" target="_blank">TFR</a> | <a href="https://www.1800wxbrief.com/Website/weatherGraphics?conus=0" target="_blank">1800WXBrief</a> | <a href="https://www.aviationweather.gov" target="_blank">AviationWeather</a> | <a href="https://www.iFlightPlanner.com/AviationCharts/?Map=sectional&GS=115&Route=KRHV" target="_blank">iFlightPlanner</a> | <a href="https://skyvector.com/" target="_blank">Skyvector</a> <div class="powerby">${Locales.powerBy}</div>`
})
export class AppFooterComponent {
  tfrLink = environment.tfrLink;
}

@NgModule({
  imports: [CommonModule],
  exports: [AppFooterComponent],
  declarations: [AppFooterComponent]
})
export class AppComponentModule {
}
