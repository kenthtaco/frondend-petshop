import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de importar el servicio
import { CommonModule } from '@angular/common';
import { CategoryService } from 'src/app/services/category.service';

declare var bootstrap: any;

@Component({
  selector: 'app-products-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.scss']
})
export class ProductsDetailComponent {
  products: Product[] = [];
  categories: any[] = []; // Lista de categorías
  productsByCategory: { [key: string]: Product[] } = {}; // Agrupación de productos por categoría
  newProduct: Product = { name: '', description: '', price: 0, stockQuantity: 0, categoryId: 0, imageUrl: '' };
  editingProductId: number | null = null;
  selectedProduct: Product | null = null;
  cartCount = 0;  
  notificationMessage: string = '';
  isSuccess: boolean = false;

  // Inyectamos los servicios en el constructor
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private categoryService: CategoryService,   
    private router: Router,
    private activatedRoute: ActivatedRoute           
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });

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

  resetForm() {
    this.newProduct = { name: '', description: '', price: 0, stockQuantity: 0, categoryId: 0, imageUrl: '' };
    this.editingProductId = null;
  }

  // Método para abrir el modal con los detalles del producto
  showModal(): void {
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openModal(product: Product): void {
    this.selectedProduct = product;
    this.showModal();
    console.log('Modal abierto con producto:', product); 
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.selectedProduct = null;
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }

  // Método para añadir al carrito y cerrar el modal
  addToCartAndCloseModal(product: Product | null): void {
    if (product) {
      // Llamamos al servicio para añadir el producto
      this.cartService.addProduct(product);
      this.notificationMessage = 'Producto añadido al carrito exitosamente!';
      this.isSuccess = true;
      this.cartCount++; // Incrementamos el contador de productos en el carrito
      
      // Cerrar el modal de producto
      this.closeModal();
    } else {
      this.notificationMessage = 'No se pudo añadir el producto al carrito';
      this.isSuccess = false;
    }

    // Mostrar el modal de notificación
    this.openNotificationModal();
  }

  // Abrir el modal de notificación
  openNotificationModal(): void {
    const modalElement = document.getElementById('notificationModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // Cerrar el modal de notificación después de 2 segundos
    setTimeout(() => {
      this.closeNotificationModal();
    }, 2100);
  }

  // Cerrar el modal de notificación
  closeNotificationModal(): void {
    const modalElement = document.getElementById('notificationModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  scrollToTarget(fragment: string) {
    let scrollPosition = 0;
  
    // Asigna una posición de desplazamiento diferente para cada fragmento
    switch(fragment) {
      case 'scroll1':
        scrollPosition = 600; // Comida
        break;
      case 'scroll2':
        scrollPosition = 10; // Accesorios
        break;
      case 'scroll3':
        scrollPosition = 1150; // Ropa
        break;
      case 'scroll4':
        scrollPosition = 1750; // Aseo
        break;
      case 'scroll5':
        scrollPosition = 2330; // Medicina
        break;
      case 'scroll6':
        scrollPosition = 2930; // Otros
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
      if (this.router.url === '/usuario') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }
}
