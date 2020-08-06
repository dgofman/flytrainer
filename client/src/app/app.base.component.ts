import { environment } from '@client/environments/environment';
import { Directive } from '@angular/core';
import { User } from 'src/modules/models/user';
import { faPlane, faChalkboardTeacher as faInstructor } from '@fortawesome/free-solid-svg-icons';
import { AppUtils } from './utils/AppUtils';

@Directive()
export abstract class AppBaseDirective {
    environment = environment;
    loggedUser: User = new User();
    toggleArroMenu: boolean;

    faPlane = faPlane;
    faInstructor = faInstructor;

    constructor() {
        const auth = JSON.parse(sessionStorage.getItem('auth_data'));
        this.loggedUser = new User(auth);
    }

    loading(show: boolean) {
        AppUtils.loading(show);
    }

    errorHandler(ex: any, errorMap: { [code: string]: string } = {}) {
        AppUtils.errorHandler(ex, errorMap);
    }
}
