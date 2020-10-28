import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: '<h2>Oops! Page not found</h2><h4><a routerLink="../login">Home</a></h4>'
})
export class AppNotFoundComponent {
  constructor(route: ActivatedRoute) {
    route.url.subscribe(url => console.error('Page Not Found:', url[0].path));
  }
}
