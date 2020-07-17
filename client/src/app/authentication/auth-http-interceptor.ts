import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@client/environments/environment';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
    private static AUTH_TOKEN: string;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req.headers.set('Access-Control-Allow-Origin', '*');
        req.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        req.headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        req.headers.set('Authorization', 'Bearer ' + AuthHttpInterceptor.AUTH_TOKEN);

        const newRequest = req.clone({
            url: environment.native ? environment.endpoint + req.url : req.url,
            headers: req.headers
        });
        return next.handle(newRequest);
    }
}
