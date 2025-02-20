import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SidebarService } from './sidebar.service';
// Importar el servicio compartido

declare const bootstrap: any; 

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isClosed = true; // Inicialmente abierto
  isVisible = false; // Controla si el sidebar es visible

  constructor(
    public authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService // Inyectar el servicio compartido
  ) {
    // Suscribirse al estado de autenticación para mostrar/ocultar el sidebar
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isVisible = isAuthenticated; // Mostrar el sidebar solo si el usuario está autenticado
    });

    // Suscribirse al estado del sidebar
    this.sidebarService.isClosed$.subscribe((isClosed) => {
      this.isClosed = isClosed;
    });
  }

  // Alternar el estado del sidebar usando el servicio
  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  // Cerrar el sidebar automáticamente en pantallas pequeñas
  closeSidebar(): void {
    if (window.innerWidth < 992) {
      this.sidebarService.toggleSidebar();
    }
  }

  logout(): void {
    // Realiza el logout en el servicio de autenticación
    this.authService.logout();

    // Cierra el modal de forma programática
    const logoutModal = bootstrap.Modal.getInstance(document.getElementById('logoutModal'));
    logoutModal.hide();  // Cierra el modal

    // Redirige al usuario a la página de inicio o login
    this.router.navigate(['/login']);
  }
  openLogoutModal() {
    const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    logoutModal.show();
  }
}
