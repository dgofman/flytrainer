import Locales from '@locales/common';
import { AppOverlayComponent, AppToastComponent } from '../app.component';
import { Session, Role } from 'src/modules/models/constants';

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

    static getSession(): Session {
        return JSON.parse(sessionStorage.getItem('auth_data') || '{}') as Session;
    }

    static canViewAdmin(): boolean {
        return AppUtils.isReviewAccess();
    }

    static isEditorAccess(): boolean {
        const session = AppUtils.getSession();
        return session.role === Role.ADMIN || session.role === Role.MANAGER;
    }

    static isReviewAccess(): boolean {
        const session = AppUtils.getSession();
        return session.role === Role.ADMIN || session.role === Role.MANAGER || session.role === Role.ASSISTANT;
    }
}
