import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppNotFoundComponent } from './app.notfound.component';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { AuthService } from './authentication/auth.service';
import { HttpClientModule } from '@angular/common/http';

const AuthRouteMatcher = (url: UrlSegment[]) => {
  if (url.length) {
    switch (url[0].path) {
      case 'login':
      case 'create':
      case 'forgot':
      case 'reset':
      case 'activate':
        return {consumed: url};
    }
  }
  return null;
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
      matcher: AuthRouteMatcher,
      loadChildren: () => import('./authentication/auth.component').then(m => m.AuthComponentModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthService],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '**', component: AppNotFoundComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    AppNotFoundComponent
  ],
  exports: [RouterModule],
  providers: [AuthService, Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
