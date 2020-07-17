import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppNotFoundComponent } from './app.notfound.component';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./authentication/login.component').then(m => m.LoginComponentModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./authentication/reset.component').then(m => m.ResetComponentModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '**', component: AppNotFoundComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    AppNotFoundComponent
  ],
  exports: [RouterModule],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
