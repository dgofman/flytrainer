import { environment } from '@client/environments/environment';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent, AppOverlayComponent, AppToastComponent } from './app.component';
import { AppNotFoundComponent } from './app.notfound.component';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { AuthService, AdminAuthService } from './authentication/auth.service';
import { HttpClientModule } from '@angular/common/http';

const AuthRouteMatcher = (url: UrlSegment[]) => {
  if (url.length) {
    switch (url[0].path) {
      case 'login':
      case 'reset':
      case 'activate':
        return { consumed: url };
    }
  }
  return null;
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'forgot',
    loadChildren: () => import('./authentication/auth.component').then(m => m.AuthComponentModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./authentication/auth.component').then(m => m.AuthComponentModule)
  },
  {
    matcher: AuthRouteMatcher,
    loadChildren: () => import('./authentication/auth.component').then(m => m.AuthComponentModule)
  },
  {
    path: 'admin',
    canActivate: [AdminAuthService],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
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
    NoopAnimationsModule,
    RouterModule.forRoot(routes, {
      useHash: environment.native
    })
  ],
  declarations: [
    AppComponent,
    AppToastComponent,
    AppOverlayComponent,
    AppNotFoundComponent
  ],
  exports: [RouterModule],
  providers: [AuthService, AdminAuthService, Title],
  bootstrap: [AppComponent]
})
export class AppModule { }

console.log('%cFlyTrainer.com', 'font: 60px roboto; font-weight:bold; color: red; -webkit-text-stroke:1px black; background-color: yellow; border-radius: 20px; padding: 20px');
