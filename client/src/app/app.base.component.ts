import Locales from '@locales/common';
import { environment } from '@client/environments/environment';
import { Directive } from '@angular/core';
import { Session, ColumnType } from 'src/modules/models/constants';
import { AppHeaderComponent } from './app.component';
import { AppUtils } from './utils/app-utils';
import { FTIcons } from './component/ft-menu/ft-menu.component';
import { AuthService } from './authentication/auth.service';
import { BaseModel } from 'src/modules/models/base.model';
import { FTFormControl } from './utils/ft-form.control';

@Directive()
export abstract class AppBaseDirective {
    AppUtils = AppUtils;
    session: Session;
    environment = environment;
    token = AuthService.token;
    icons = FTIcons;

    constructor() {
        this.session = AppUtils.getSession();
    }

    get baseURL() {
        return environment.native ? environment.endpoint : '';
    }

    get toggleArrowMenu(): boolean {
        return AppHeaderComponent.toggleArrowMenu;
    }

    formatColData(col: ColumnType, rowData: BaseModel, title: boolean) {
        const val = FTFormControl.getData(col, rowData);
        if (title && col.format === 'bool') {
            return val ? Locales.yes : Locales.no;
        }
        return this.formatData(val, col.format);
    }

    formatData(data: any, format: string) {
        return FTFormControl.Format(data, format);
    }

    loading(show: boolean) {
        AppUtils.loading(show);
    }

    success(message: string) {
        AppUtils.success(message);
    }

    errorHandler(ex: any, errorMap: { [code: string]: string } = {}) {
        AppUtils.errorHandler(ex, errorMap);
    }
}
