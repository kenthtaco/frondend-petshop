import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model'; // Asegúrate de tener el modelo User correctamente importado
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router'; // Asegúrate de que Router esté importado
import { CommonModule } from '@angular/common';

declare var bootstrap: any; // Para manejar el modal de Bootstrap

@Component({
  standalone: true,
  imports: [FormsModule, LoadingSpinnerComponent, CommonModule,  RouterModule, HeaderComponent, FooterComponent],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterComponent {
  user: User = {
    username: '',
    email: '',
    password: '',
    role: 'customer', // Rol por defecto
  };

  loading = false; // Para manejar el estado de carga
  registerSuccess = false; // Para saber si el registro fue exitoso
  // Inicialmente el header y footer son visibles

  constructor(private authService: AuthService, private router: Router) {
    // Suscripción al estado de autenticación
 
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

  // Este método debe ser llamado al enviar el formulario de registro
  onRegister(): void {
    let registerObservable;

    // Verificar el tipo de usuario y llamar al método correspondiente
    if (this.user.role === 'admin') {
      registerObservable = this.authService.registerAdmin(this.user);
    } else if (this.user.role === 'seller') {
      registerObservable = this.authService.registerSeller(this.user);
    } else if (this.user.role === 'customer') {
      registerObservable = this.authService.registerCustomer(this.user);
    }

    // Ejecutar la suscripción dependiendo del tipo de usuario
    this.loading = true; // Inicia el estado de carga

    registerObservable?.subscribe(
      (response) => {
        // Cambiar el estado a registrado
        this.registerSuccess = true;

        // Mostrar el modal de éxito
        const modalElement = document.getElementById('registerModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      },
      (error) => {
        alert('Registro fallido');
        console.error(error);
      },
      () => {
        this.loading = false; // Finaliza el estado de carga
      }
    );
  }
  openLoginModal(): void {
    // Crear el modal dinámicamente
    const modalHTML = `
      <div id="openloginModal" class="modal fade">
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
    const modalElement = document.getElementById('openloginModal');
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
    const modalElement = document.getElementById('openloginModal');
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
    const modalElement = document.getElementById('openloginModal');
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

  // Método para cerrar sesión
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

    // Método para bloquear la recarga de la página
    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      $event.returnValue = true; // Esto muestra una alerta de confirmación para el usuario
    }

  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef; // Contenedor para el scroll

  // Método para desplazarse al contenedor de categorías
  scrollToCategories() {
    // Desplazar al contenedor con animación suave
    this.categoriesContainer.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
