import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { AuthService } from 'src/app/services/auth.service';
import { FooterComponent } from 'src/app/shared/footer/footer.component';

declare var bootstrap: any;  // Asegúrate de que Bootstrap esté importado globalmente

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, LoadingSpinnerComponent, RouterModule, HeaderComponent, FooterComponent], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements AfterViewInit {
  loading = false;
  showModal: boolean = false;
  
  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef;

  constructor(public authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {

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

  openLoginModal(): void {
    // Crear el modal dinámicamente
    const modalHTML = `
    <div id="loginModal" class="modal fade" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title text-center fw-bold" id="loginModalLabel" style="
              font-size: 1.25rem; 
              color: #ffffff; 
              margin: auto; 
              font-family: 'Arial', sans-serif;">
              Por favor, inicia sesión para continuar
            </h5>
           
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="text-center">
              <p class="mb-3">Debe iniciar sesión como cliente para poder realizar una compra.</p>
              <p><i class="bi bi-person-circle" style="font-size: 50px;"></i></p>
            </div>
            <div class="text-center">
              <p>¿Aún no tienes cuenta?</p>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button class="btn btn-primary" id="loginButton">Iniciar sesión</button>
            <button class="btn btn-outline-secondary" id="registerButton">Registrarse</button>
          </div>
        </div>
      </div>
    </div>`;
  

    // Insertar el modal en el DOM
    const bodyElement = document.body;
    bodyElement.insertAdjacentHTML('beforeend', modalHTML);

    // Mostrar el modal
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      // Asignar eventos a los botones
      const loginButton = document.getElementById('loginButton');
      const registerButton = document.getElementById('registerButton');
      
      if (loginButton) {
        loginButton.addEventListener('click', () => {
          this.navigateToLogin();
        });
      }

      if (registerButton) {
        registerButton.addEventListener('click', () => {
          this.navigateToRegister();
        });
      }

      // Evento para eliminar el modal después de ocultarlo
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.removeLoginModal();
      });
    }
  }

  closeLoginModal(): void {
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement); // Obtener la instancia del modal
      if (modalInstance) {
        modalInstance.hide(); // Ocultar el modal
      }
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.removeLoginModal(); // Eliminar el modal del DOM después de ocultarlo
      });
    }
  }

  private removeLoginModal(): void {
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      modalElement.remove(); // Eliminar el modal del DOM
    }
  }

  // Navegar al login
  navigateToLogin(): void {
    this.closeLoginModal(); // Cerrar el modal antes de redirigir
    this.router.navigate(['/login']);
  }

  // Navegar al registro
  navigateToRegister(): void {
    this.closeLoginModal(); // Cerrar el modal antes de redirigir
    this.router.navigate(['/register']);
  }

  scrollToCategories() {
    window.scrollTo({
      top: 550, // Aquí defines el valor en píxeles a donde deseas desplazarte
      behavior: 'smooth'
    });
  }

  ngAfterViewInit() {
    // Comprobar si el fragmento es 'scroll-to-categories'
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment === 'scroll-to-categories') {
        this.scrollToCategories();
      }
    });
  }
}
