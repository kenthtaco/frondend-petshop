import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard'; // Asegúrate de importar el RoleGuard

import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

import { DashboardModule } from './dashboard/dashboard.module';
import { PagesModule } from './pages/pages.module';
import '@angular/compiler'; 

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routes';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppComponent } from './app.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { ComentariosComponent } from './pages/comentarios/comentarios.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';  // Importa el idioma español
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeEs); 

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AppComponent,
    CarritoComponent,
    ComentariosComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DashboardModule,
    ReactiveFormsModule,
    CommonModule,
    PagesModule,
    RouterModule,
    OAuthModule.forRoot(),
    SharedModule,
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Interceptor para manejar el token
    AuthGuard, // Guard para verificar si el usuario está autenticado
    RoleGuard, // Guard para verificar el rol del usuario (Admin)
    TokenService, // Servicio para manejar el token JWT
    AuthService, // Servicio para autenticación y roles
    { provide: LOCALE_ID, useValue: 'es' } 
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
