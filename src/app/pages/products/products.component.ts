import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { ProductService } from 'src/app/services/product.service';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/category.service'; // Asegúrate de tener el servicio de categorías

declare var bootstrap: any;  // Asegúrate de que Bootstrap esté importado globalmente

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RouterModule, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, AfterViewInit {
  categories: any[] = []; // Lista de categorías
  products: Product[] = [];
  productsByCategory: { [key: string]: Product[] } = {}; // Agrupación de productos por categoría
  newProduct: Product = { name: '', description: '', price: 0, stockQuantity: 0, categoryId: 0, imageUrl: '' };
  editingProductId: number | null = null;
  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService, // Asegúrate de tener el servicio para obtener categorías
    private cartService: CartService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtener las categorías primero
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categories = categories; // Guardamos las categorías
        this.loadProducts();
      },
      (error) => {
        console.error('Error al cargar las categorías', error);
      }
    );
  }

  loadProducts(): void {
    // Intentar cargar productos desde el localStorage primero
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      this.products = JSON.parse(savedProducts); // Si existen productos en localStorage, los cargamos
      this.groupProductsByCategory();
    }

    // Luego, sincronizar con el backend
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products; // Actualizamos la lista de productos
        localStorage.setItem('products', JSON.stringify(products)); // Guardamos los productos en localStorage
        this.groupProductsByCategory(); // Agrupamos los productos por categoría
      },
      (error) => {
        console.error('Error al cargar los productos desde el backend:', error);
      }
    );
  }

  groupProductsByCategory(): void {
    // Agrupamos los productos por categoría
    this.productsByCategory = this.categories.reduce((acc, category) => {
      acc[category.name] = this.products.filter(product => product.categoryId === category.id);
      return acc;
    }, {});
  }

  navigateToHome() {
    // Navegar al HomeComponent y agregar un fragmento a la URL
    this.router.navigate(['/'], { fragment: 'scroll-to-categories' });
  }

  resetForm() {
    this.newProduct = { name: '', description: '', price: 0, stockQuantity: 0, categoryId: 0, imageUrl: '' };
    this.editingProductId = null;
  }

  openLoginModal(): void {
    // Crear el modal dinámicamente
    const modalHTML = `
      <div id="openloginModal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title text-center fw-bold" id="loginModalLabel" style="font-size: 1.25rem; color: #ffffff; margin: auto; font-family: 'Arial', sans-serif;">
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

  scrollToTarget(fragment: string) {
    let scrollPosition = 0;
  
    // Asigna una posición de desplazamiento diferente para cada fragmento
    switch(fragment) {
      case 'scroll1':
        scrollPosition = 650; // Comida
        break;
      case 'scroll2':
        scrollPosition = 10; // Accesorios
        break;
      case 'scroll3':
        scrollPosition = 1240; // Ropa
        break;
      case 'scroll4':
        scrollPosition = 1890; // Aseo
        break;
      case 'scroll5':
        scrollPosition = 2500; // Medicina
        break;
      case 'scroll6':
        scrollPosition = 3150; // Otros
        break;
      default:
        scrollPosition = 0;
    }
  
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  }
  
  ngAfterViewInit() {
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        this.scrollToTarget(fragment);  // Usa el fragmento directamente
      }
    });

    // Detecta cuando estamos en el home y restablece la posición del scroll
    this.router.events.subscribe(() => {
      if (this.router.url === '/') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }
}