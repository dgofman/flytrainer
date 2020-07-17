import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    isLoggedIn: boolean;

    login(): boolean {
        return true;
    }

    logout(): void {
    }
}
