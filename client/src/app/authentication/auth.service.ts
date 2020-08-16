import { environment } from '@client/environments/environment';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CanActivate, Router } from '@angular/router';
import { AppUtils } from '../utils/app-utils';

@Injectable()
export class AuthService implements HttpInterceptor, CanActivate {
    private static AUTH_TOKEN: string;
    private static CORRELATION_ID: string;

    constructor(private http: HttpClient, private router: Router) {
        const session = AppUtils.getSession();
        AuthService.AUTH_TOKEN = session.token;
        AuthService.CORRELATION_ID = String(session.correlationId);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let url = req.url;
        if (environment.native) {
            if (!environment.proxy[`/${url.split('/')[1]}`]) {  // handle by electron.session.defaultSession.webRequest.onBeforeRequest in electron.js
                url = environment.endpoint + req.url;
            }
        }
        let headers = req.headers.set('SourceMap', environment.native ? '#' : '/');
        if (AuthService.AUTH_TOKEN) {
            headers = headers
                .set('Authorization', 'Bearer ' + AuthService.AUTH_TOKEN)
                .set('CorrelationId', AuthService.CORRELATION_ID);
        }
        return next.handle(req.clone({url, headers}));
    }

    reset() {
        AuthService.AUTH_TOKEN = null;
        AuthService.CORRELATION_ID = null;
        sessionStorage.removeItem('auth_data');
    }

    login(json: any) {
        sessionStorage.setItem('auth_data', JSON.stringify(json));
        AuthService.AUTH_TOKEN = json.token;
        AuthService.CORRELATION_ID = json.correlationId;
    }

    logout() {
        this.http.post('/logout', { cid: environment.clientId, correlationId: AuthService.CORRELATION_ID, token: AuthService.AUTH_TOKEN }).subscribe(_ => {
            this.reset();
            this.router.navigate(['login']);
        }, (ex) => console.error(ex));
    }

    canActivate(): boolean {
        if (!AuthService.AUTH_TOKEN) {
            alert('You are not allowed to view this page. You are redirected to login Page');
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}

@Injectable()
export class AdminAuthService extends AuthService implements CanActivate {
    canActivate(): boolean {
        const isValid = super.canActivate();
        if (!isValid) {
            return false;
        }
        return  AppUtils.isReviewAccess();
    }
}

