import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router'; // Asegúrate de que Router esté importado
import { FormsModule } from '@angular/forms';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { NavigationEnd, NavigationStart } from '@angular/router';

declare var bootstrap: any; // Para manejar el modal de Bootstrap

@Component({
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RouterModule, HeaderComponent, FooterComponent, FormsModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent {
  credentials = {
    username: '',
    password: '',
    role: ''
  };

  loading = false; // Para manejar el estado de carga
  loginSuccess = false; // Para saber si el login fue exitoso

  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef; // Contenedor para el scroll

  constructor(private authService: AuthService, private router: Router) {
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

  // Este método debe ser llamado al enviar el formulario de login
  onLogin(): void {
    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Guardamos el nombre de usuario, el rol y el token en localStorage
        localStorage.setItem('username', this.credentials.username);
        localStorage.setItem('role', response.role);
        localStorage.setItem('token', response.token);

        this.loginSuccess = true;

        const modalElement = document.getElementById('loginModal');
        if (modalElement) {
          modalElement.classList.add('show');
          modalElement.removeAttribute('inert');
          const modal = new bootstrap.Modal(modalElement);
          modal.show();

          // Redirección después de 2 segundos
          setTimeout(() => {
            modal.hide();
            modalElement.setAttribute('inert', '');
            modalElement.classList.remove('show');

            // Redirigir según el rol
            if (this.authService.isAdmin()) {
              this.router.navigate(['/dashboard']); // Redirigir al dashboard si es admin
            } else if (this.credentials.role === 'CUSTOMER') {
              this.router.navigate(['/usuario']); // Redirigir al perfil si es cliente
            } else {
              this.router.navigate(['/']); // O al home si es otro rol
            }
          }, 2000);
        }
      },
      error: (error) => {
        alert('Error en el inicio de sesión');
        console.error(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
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


  // Método para desplazarse al contenedor de categorías
  scrollToCategories() {
    // Desplazar al contenedor con animación suave
    this.categoriesContainer.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
