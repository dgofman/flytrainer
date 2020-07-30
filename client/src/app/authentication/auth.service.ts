import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CanActivate, Router } from '@angular/router';
import { environment } from '@client/environments/environment';

@Injectable()
export class AuthService implements HttpInterceptor, CanActivate {
    private static AUTH_TOKEN: string;
    private static CORRELATION_ID: string;

    constructor(private http: HttpClient, private router: Router) {
        const auth = JSON.parse(sessionStorage.getItem('auth_data') || '{}');
        AuthService.AUTH_TOKEN = auth.token;
        AuthService.CORRELATION_ID = auth.correlationId;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newRequest = req.clone({
            url: environment.native ? environment.endpoint + req.url : req.url,
            headers: req.headers
                .set('Authorization', 'Bearer ' + AuthService.AUTH_TOKEN)
                .set('CorrelationId', String(AuthService.CORRELATION_ID))
        });
        return next.handle(newRequest);
    }

    login(json: any) {
        sessionStorage.setItem('auth_data', JSON.stringify(json));
        AuthService.AUTH_TOKEN = json.token;
        AuthService.CORRELATION_ID = json.correlationId;
    }

    logout() {
        this.http.post('/logout', { cid: environment.clientId, correlationId: AuthService.CORRELATION_ID, token: AuthService.AUTH_TOKEN }).subscribe(_ => {
            AuthService.AUTH_TOKEN = null;
            AuthService.CORRELATION_ID = null;
            sessionStorage.removeItem('auth_data');
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
