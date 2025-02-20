// src/main.ts
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideRouter, withRouterConfig } from '@angular/router';

import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { AuthGuard } from './app/guards/auth.guard';
import { DashboardModule } from './app/dashboard/dashboard.module';
import { PagesModule } from './app/pages/pages.module';
import { SharedModule } from './app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { RoleGuard } from './app/guards/role.guard';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      HttpClientModule,
      FormsModule,
      DashboardModule,
      PagesModule,
      SharedModule,
      RouterModule // Asegúrate de importar RouterModule aquí
    ),
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    RoleGuard
  ]
});
