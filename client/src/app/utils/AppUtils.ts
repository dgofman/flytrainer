import Locales from '@locales/common';
import { AppOverlayComponent, AppToastComponent } from '../app.component';

export class AppUtils {

    static timeoutId: any;

    static loading(show: boolean) {
        clearTimeout(AppUtils.timeoutId);
        AppUtils.timeoutId = setTimeout(() => {
            AppOverlayComponent.el.nativeElement.style.display = show ? 'block' : 'none';
        }, show ? 1 : 100);
    }

    static errorHandler(ex: any, errorMap: { [code: string]: string }) {
        AppUtils.loading(false);
        if (ex.status === 404 || ex.status % 500 < 50 || !ex.error) {
            AppUtils.error(Locales.internalError);
        } else {
            if (typeof(ex.error) === 'string') {
                return AppUtils.error(ex.error);
            }
            const err = (ex.error || {});
            if (err.code && errorMap[err.code]) {
                return AppUtils.error(errorMap[err.code]);
            }
            AppUtils.error(err.message ? ex.error.message : JSON.stringify(err));
        }
    }

    static error(mesage: string) {
        AppToastComponent.add('error', mesage);
    }

    static success(mesage: string) {
        AppToastComponent.add('success', mesage);
    }
}
