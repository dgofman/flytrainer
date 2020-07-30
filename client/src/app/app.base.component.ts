import { ChangeDetectorRef, Directive } from '@angular/core';
import { AppOverlayComponent } from './app.component';
import Locales from '@locales/common';


@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class AppBaseComponent {
    message: string;
    error: string;

    constructor(private changeDetector: ChangeDetectorRef) {
    }

    loading(show: boolean) {
        AppOverlayComponent.el.nativeElement.style.display = show ? 'block' : 'none';
    }

    errorHandler(ex: any) {
        this.loading(false);
        this.message = null;
        if (ex.status === 404 || ex.status % 500 < 50 || !ex.error) {
            this.error = Locales.internalError;
        } else {
            this.error = JSON.stringify(ex.error);
        }
        this.changeDetector.detectChanges();
    }

    internalError() {
        this.errorHandler({ error: Locales.internalError });
    }
}
