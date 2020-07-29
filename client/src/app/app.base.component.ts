import { ChangeDetectorRef, ViewChild, Directive } from '@angular/core';
import { AppOverlayComponent } from './app.component';
import Locales from '@locales/common';


@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class AppBaseComponent {

    message: string;
    error: string;

    @ViewChild(AppOverlayComponent)
    overlay: AppOverlayComponent;

    constructor(private changeDetector: ChangeDetectorRef) {
    }

    errorHandler(ex: any) {
        if (this.overlay) {
            this.overlay.display(false);
        }
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
