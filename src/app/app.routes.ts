import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './dashboard/category/category.component';
import { DashboardComentariosComponent } from './dashboard/dashboard-comentarios/dashboard-comentarios.component';
import { DashboardOrderComponent } from './dashboard/dashboard-order/dashboard-order.component';
import { DashboardProductsComponent } from './dashboard/dashboard-products/dashboard-products.component';

import { MainComponent } from './dashboard/main/main.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard'; // Importa el RoleGuard
import { CarritoComponent } from './pages/carrito/carrito.component';
import { ComentariosComponent } from './pages/comentarios/comentarios.component';
import { ContactenosComponent } from './pages/contactenos/contactenos.component';
import { HomeComponent } from './pages/home/home.component';

import { LoginComponent } from './pages/login/login.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { ProductsDetailComponent } from './pages/products-detail/products-detail.component';
import { ProductsComponent } from './pages/products/products.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardContactenosComponent } from './dashboard/dashboard-contactenos/dashboard-contactenos.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

// Definición de rutas
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard] },
  { path: 'comentarios', component: ComentariosComponent, canActivate: [AuthGuard] },
  { path: 'contactenos', component: ContactenosComponent, canActivate: [AuthGuard] },
  { path: 'noticias', component: NoticiasComponent, canActivate: [AuthGuard] },
  { path: 'order', component: HomeComponent, canActivate: [AuthGuard] }, // Redirigir al Home si es cliente
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductsDetailComponent },

  // Rutas protegidas por AuthGuard y RoleGuard según el rol
  { 
    path: 'dashboard', 
    component: SidebarComponent,
    canActivate: [AuthGuard], // Primero verificar autenticación
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: MainComponent },
      { 
        path: 'products', 
        component: DashboardProductsComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'ROLE_ADMIN' } // Solo accesible por ADMIN
      },
      { 
        path: 'order', 
        component: DashboardOrderComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'ROLE_ADMIN' } // Solo accesible por ADMIN
      },
      { 
        path: 'category', 
        component: CategoryComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'ROLE_ADMIN' } // Solo accesible por ADMIN
      },
      { 
        path: 'contactanos', 
        component: DashboardContactenosComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'ROLE_ADMIN' } // Solo accesible por ADMIN
      },
      { 
        path: 'comentarios', 
        component: DashboardComentariosComponent, 
        canActivate: [RoleGuard], 
        data: { role: 'ROLE_ADMIN' } // Solo accesible por ADMIN
      },
    ] 
  },

  // Agregar rutas para vendedores si es necesario
  {
    path: 'dashboard-seller',
    component: SidebarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'SELLER' },
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'products', component: DashboardProductsComponent },
      { path: 'order', component: DashboardOrderComponent },
      { path: 'contactenos', component: DashboardContactenosComponent },
      { path: 'comentarios', component: DashboardComentariosComponent },
    ]
  },

  // Agregar rutas para administradores si es necesario
  {
    path: 'dashboard-customer',
    component: SidebarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' }, // Solo accesible por ADMIN
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'order', component: DashboardOrderComponent }, // Solo accesible por CLIENTES a través de Admin
      { path: 'comentarios', component: DashboardComentariosComponent }, // Solo accesible por CLIENTES a través de Admin
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
