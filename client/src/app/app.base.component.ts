import { environment } from '@client/environments/environment';
import { Directive } from '@angular/core';
import { faPlane, faPencilAlt, faChalkboardTeacher as faInstructor } from '@fortawesome/free-solid-svg-icons';
import { Session } from 'src/modules/models/constants';
import { AppUtils } from './utils/app-utils';

@Directive()
export abstract class AppBaseDirective {
    AppUtils = AppUtils;
    session: Session;
    environment = environment;
    toggleArroMenu: boolean;

    faPlane = faPlane;
    faInstructor = faInstructor;
    faPencil = faPencilAlt;

    constructor() {
        this.session = AppUtils.getSession();
    }

    loading(show: boolean) {
        AppUtils.loading(show);
    }

    errorHandler(ex: any, errorMap: { [code: string]: string } = {}) {
        AppUtils.errorHandler(ex, errorMap);
    }
}
