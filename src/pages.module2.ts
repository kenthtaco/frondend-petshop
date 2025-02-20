import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './app/pages/register/register.component';
import { LoginComponent } from './app/pages/login/login.component';
import { ProductsComponent } from './app/pages/products/products.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    // No declares ProductsComponent si es standalone
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProductsComponent // Importa el componente standalone aquí
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ProductsComponent // Exporta si es necesario
  ]
})
export class PagesModule2 { }
