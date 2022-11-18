import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  template: '<h2>Oops! Page not found</h2><h4><a routerLink="../login">Home</a></h4>'
})
export class AppNotFoundComponent implements OnDestroy {

    subs: Subscription;

    constructor(route: ActivatedRoute) {
        this.subs = route.url.subscribe(url => console.error('Page Not Found:', url[0].path));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
