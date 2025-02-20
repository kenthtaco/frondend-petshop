import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { AuthService } from 'src/app/services/auth.service';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { ImageCroppedEvent } from 'ngx-image-cropper'; // Importa el evento para la imagen recortada
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/models/product.model';

declare var bootstrap: any; // Para manejar el modal de Bootstrap

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RouterModule, HeaderComponent, FooterComponent], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  products: Product[] = [];
  user: any = {
    username: '',
    role: '',
    profilePicture: localStorage.getItem('profilePicture') || '/assets/default-profile.png'
  };

  loading = false; // Variable para controlar el spinner
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isModalOpen: boolean = false;
  cartCount = 0;   // Controla si el modal está abierto o cerrado
  imagePreview: string = ''; // Nueva variable para la vista previa de la imagen seleccionada

  constructor(private router: Router, public authService: AuthService, private cartService: CartService) {
    // Manejo de eventos de navegación para mostrar el spinner
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true; // Mostrar el spinner al iniciar la navegación
      }
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.loading = false; // Ocultar el spinner después de la navegación
          const spinnerContainer = document.querySelector('.spinner-container');
          if (spinnerContainer) {
            spinnerContainer.classList.add('hidden'); // Opcional: añade clase para animación de ocultar
          }
        }, 1000); // Retraso opcional de 1 segundo
      }
    });
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

  // Método para añadir al carrito
  addToCart(product: Product | null): void {
    if (product) {
      this.cartService.addProduct(product); // Llamamos al servicio para añadir el producto
      alert('Producto añadido al carrito!');
      this.closeModal();
      this.cartCount++; 
    } else {
      console.warn('No se seleccionó un producto válido');
    }
  }

  ngOnInit(): void {
    // Recuperamos las credenciales del usuario desde localStorage
    this.user.username = localStorage.getItem('username') || 'Nombre Usuario';
    this.user.role = localStorage.getItem('role') || 'Cliente';

    // Inicializar el modal cerrado
    const modalElement = document.getElementById('editImageModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.hide(); // Asegura que el modal esté cerrado al iniciar
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  // Método para activar el input de archivo
  triggerFileInput(): void {
    this.fileInput.nativeElement.click(); // Simula un clic en el input de archivo
  }

  // Método para manejar el cambio de archivo
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string; // Almacena la imagen seleccionada para vista previa
        this.openModal(); // Abre el modal automáticamente al cargar la imagen
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para abrir el modal
  openModal(): void {
    const modalElement = document.getElementById('editImageModal') as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal(); // Abre el modal usando showModal()
    }
  }

  // Evento cuando la imagen es recortada en el modal
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  // Método para guardar la imagen y cerrar el modal
  saveImage(): void {
    this.user.profilePicture = this.croppedImage || this.imagePreview || this.user.profilePicture; // Si hay una imagen recortada, se guarda
    localStorage.setItem('profilePicture', this.user.profilePicture); // Guarda la imagen en localStorage
    this.closeModal(); // Cierra el modal
  }

  // Método para cerrar el modal sin guardar
  closeModal(): void {
    const modalElement = document.getElementById('editImageModal') as HTMLDialogElement;
    if (modalElement) {
      modalElement.close(); // Cierra el modal usando close()
    }
  }

  // Cancelar la edición de la imagen
  cancelImage() {
    this.isModalOpen = false; // Cerrar el modal sin guardar cambios
  }

  
  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef;

  // Método para desplazar el contenedor de categorías con animación
  scrollToCategories() {
    this.categoriesContainer.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
