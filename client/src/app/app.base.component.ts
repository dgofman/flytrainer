import { environment } from '@client/environments/environment';
import { Directive } from '@angular/core';
import { Session } from 'src/modules/models/constants';
import { AppHeaderComponent } from './app.component';
import { AppUtils } from './utils/app-utils';

@Directive()
export abstract class AppBaseDirective {
    AppUtils = AppUtils;
    session: Session;
    environment = environment;

    constructor() {
        this.session = AppUtils.getSession();
    }

    get toggleArrowMenu(): boolean {
        return AppHeaderComponent.toggleArrowMenu;
    }

    loading(show: boolean) {
        AppUtils.loading(show);
    }

    errorHandler(ex: any, errorMap: { [code: string]: string } = {}) {
        AppUtils.errorHandler(ex, errorMap);
    }
}
