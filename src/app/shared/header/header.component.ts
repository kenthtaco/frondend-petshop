import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, LoadingSpinnerComponent, RouterModule],
  
})
export class HeaderComponent {
  loading = false;
  isVisible = true; // Inicialmente el header es visible

  constructor(public authService: AuthService, private router: Router) {
    
    // Suscripción al estado de autenticación
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isVisible = !isAuthenticated; // Si el usuario está logueado, ocultar el header
    });

    // Manejo de eventos de navegación para mostrar el spinner
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true; // Mostrar el spinner cuando empieza la navegación
      }
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.loading = false; // Dejar de mostrar el spinner

          const spinnerContainer = document.querySelector('.spinner-container');
          if (spinnerContainer) {
            spinnerContainer.classList.add('hidden');
          }
        }, 1000); // Retraso de 1 segundo
      }
    });
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef;

  scrollToCategories() {
    // Desplazar al contenedor con animación suave
    this.categoriesContainer.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
