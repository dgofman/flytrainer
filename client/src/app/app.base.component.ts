import Locales from '@locales/common';
import { environment } from '@client/environments/environment';
import { Directive, OnDestroy } from '@angular/core';
import { Session, ColumnType } from 'src/modules/models/constants';
import { AppHeaderComponent } from './app.component';
import { AppUtils } from './utils/app-utils';
import { FTIcons } from './component/ft-menu/ft-menu.component';
import { BaseModel } from 'src/modules/models/base.model';
import { FTFormControl } from './utils/ft-form.control';
import { Subscription } from 'rxjs';

@Directive()
export abstract class AppBaseDirective implements OnDestroy {
    AppUtils = AppUtils;
    session: Session;
    environment = environment;
    icons = FTIcons;

    subs: Subscription;

    constructor() {
        this.session = AppUtils.getSession();
        this.subs = new Subscription();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
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
