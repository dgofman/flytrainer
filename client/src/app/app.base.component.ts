import Locales from '@locales/common';
import { environment } from '@client/environments/environment';
import { ChangeDetectorRef, Directive } from '@angular/core';
import { AppOverlayComponent } from './app.component';
import { User } from 'src/modules/models/user';
import { faPlane, faChalkboardTeacher as faInstructor } from '@fortawesome/free-solid-svg-icons';

@Directive()
export abstract class AppBaseDirective {
    environment = environment;
    loggedUser: User = new User();
    toggleArroMenu: boolean;

    message: string;
    error: string;

    faPlane = faPlane;
    faInstructor = faInstructor;

    constructor(private changeDetector: ChangeDetectorRef) {
        const auth = JSON.parse(sessionStorage.getItem('auth_data'));
        this.loggedUser = new User(auth);
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
