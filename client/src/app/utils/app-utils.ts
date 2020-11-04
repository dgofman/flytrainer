import Locales from '@locales/common';
import { AppOverlayComponent, AppToastComponent } from '../app.component';
import { Session, Role } from 'src/modules/models/constants';

export class AppUtils {

    static timeoutId: any;
    static session: Session;

    static isBlank(str: string) {
        return !str || str.split(' ').join('') === '';
    }

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

    static getKey(model: any, key: string) {
        if (!model[key]) {
            throw new Error(`The key: ${key} is not defined. Available keys: ${Object.keys(model)}`);
        }
        return key;
    }

    static get defaultYearRange(): string{
        return ((new Date().getFullYear() - 100) + ':' + (new Date().getFullYear() + 50));
    }

    static getSession(): Session {
        return  JSON.parse(sessionStorage.getItem('auth_data') || '{}') as Session;
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

    static showError(field: string, errorKey: string, error: any) {
        AppUtils.error(AppUtils.getError(field, errorKey, error));
    }

    static getError(field: string, errorKey: string, error: any): string {
        const msg = Locales[`${errorKey}Error`];
        if (msg) {
            switch (errorKey) {
                case 'required':
                    return AppUtils.format(msg, field);
                case 'email':
                    return AppUtils.format(msg, field);
                case 'maxlength': // actualLength, requiredLength
                    return  AppUtils.format(msg, field, error.requiredLength);
            }
        }
        return `${field} - ${errorKey}`;
    }

    static format(msg: string, ...args: any[]) {
        for (let i = 0; i < args.length; i++) {
            msg = msg.replace('{' + i + '}', args[i]);
        }
        return msg;
    }
}
