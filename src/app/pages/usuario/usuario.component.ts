import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';

declare var bootstrap: any; // Asegúrate de que Bootstrap esté importado globalmente

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RouterModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent {
  loading = false; // Variable para controlar el spinner
  selectedProduct: Product | null = null;
  cartCount = 0;
  notificationMessage: string = '';
  isSuccess: boolean = false;  

  

  // Productos del carrusel
  productsGroup1: Product[] = [
    {
      id: 1,
      name: 'Correa Reflectante',
      description: 'Correa para perro con material reflectante para mayor seguridad.',
      price: 12.99,
      stockQuantity: 10,
      categoryId: 1,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCIVCs42hQVNY0kZdWKN8isf5Jr02i2RWq3g&s',
      
    },
    {
      id: 2,
      name: 'Comedero Antideslizante',
      description: 'Comedero resistente y antideslizante para tu mascota.',
      price: 15.49,
      stockQuantity: 15,
      categoryId: 1,
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_958492-MLU74274164528_022024-O.webp',
    },
    {
      id: 3,
      name: 'Juguete Mordedor',
      description: 'Mordedor de goma resistente para el entretenimiento de tu perro.',
      price: 8.75,
      stockQuantity: 20,
      categoryId: 2,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiVY3NNDKbuTnyvw4ZSoLdJHzZkvfmOzU0Fg&s',
    },
    {
      id: 4,
      name: 'Cama para Perros Mediana',
      description: 'Cómoda cama para perros medianos.',
      price: 45.99,
      stockQuantity: 5,
      categoryId: 3,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYx1GO4WKw3NZGbHwVqNRk97twaxGdeGQ8fA&s',
    },
  ];

  productsGroup2: Product[] = [
    {
      id: 5,
      name: 'Collar Personalizado',
      description: 'Collar grabado con el nombre y teléfono de tu mascota.',
      price: 18.5,
      stockQuantity: 5,
      categoryId: 4,
      imageUrl: 'https://ae-pic-a1.aliexpress-media.com/kf/H84b073c187c84808bdbe6f8320213828h/Collar-de-identificaci-n-personalizado-con-grabado-de-gato-Collar-con-nombre-de-cachorro-peque-os.jpg_640x640Q90.jpg_.webp',
    },
    {
      id: 6,
      name: 'Caseta Portátil',
      description: 'Caseta portátil ideal para viajes.',
      price: 89.99,
      stockQuantity: 2,
      categoryId: 5,
      imageUrl: 'https://m.media-amazon.com/images/I/61592kRO5VL._AC_UF894,1000_QL80_.jpg',
    },
    {
      id: 7,
      name: 'Kit de Higiene',
      description: 'Kit completo para la higiene de tu mascota.',
      price: 25.99,
      stockQuantity: 10,
      categoryId: 6,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAdIVqgoORRnPO-79vxtPRmusHOzLDwub10Q&s',
    },
    {
      id: 8,
      name: 'Arenero para Gatos',
      description: 'Arenero biodegradable para gatos.',
      price: 35.0,
      stockQuantity: 8,
      categoryId: 7,
      imageUrl: 'https://poopyfever.com/cdn/shop/files/Arena-Gato-Biodegradable-Nueva-Imagen-2.png?v=1704488531',
    },
  ];

  // Productos del tercer grupo
productsGroup3: Product[] = [
  {
    id: 9,
    name: 'Cepillo para perro',
    description: 'Cepillo de alta calidad para el cuidado del pelaje de tu perro.',
    price: 3.99,
    stockQuantity: 10,
    categoryId: 24,
    imageUrl: 'https://tm-shopify037-clothes.myshopify.com/cdn/shop/files/banner_1_4360bdf1-51d7-41bb-8a4e-98bcf1c2f206_895x372_crop_center.png?v=1626334124',
  },
  {
    id: 10,
    name: 'Saco pequeño - Diseño banana',
    description: 'Ropa muy comoda para el disfrute de tu mascota y caliente',
    price: 19.00,
    stockQuantity: 15,
    categoryId: 24,
    imageUrl: 'https://tm-shopify037-clothes.myshopify.com/cdn/shop/files/banner_2_4b55bdb6-c32b-4811-aa29-6afd06cb9d49_895x372_crop_center.png?v=1626334165',
  },
  {
    id: 11,
    name: 'Utilidades para corte de pelo',
    description: 'Herramientas profesionales para el corte de pelo de tu mascota.',
    price: 5.00,
    stockQuantity: 8,
    categoryId: 24,
    imageUrl: 'https://tm-shopify037-clothes.myshopify.com/cdn/shop/files/banner_3_6fb83abe-83fc-41fa-b308-81976608744b_590x789_crop_center.png?v=1626334196',
  },
];

productsGroup4: Product[] = [
  {
    id: 1,
    name: 'Snack Para Gato Nutrapro Nugget Pollo E Hígado',
    description: 'Deliciosos snacks para gatos con pollo e hígado.',
    price: 1.35,
    stockQuantity: 50,
    categoryId: 1,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREPtNxGPktN5CCehT-MR6p1WvRVhUvsIXQhg&s'
  },
  {
    id: 2,
    name: 'Comida Para Perro Adulto Raza Mediana Buen Can',
    description: 'Comida balanceada para perros adultos de razas medianas.',
    price: 4.77,
    stockQuantity: 30,
    categoryId: 2,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXbziy659G2CnUe1l7pejJcu_0XJEWFcrKlg&s'
  },
  {
    id: 3,
    name: 'Alimento Para Gatos Sabor A Pollo CHIKI 1 Lb',
    description: 'Alimento de alta calidad para gatos con sabor a pollo.',
    price: 1.46,
    stockQuantity: 40,
    categoryId: 3,
    imageUrl: 'https://www.supermaxi.com/wp-content/uploads/2024/08/items2Figm2F1000x10002F7861002831039-1-2.jpg'
  },
  {
    id: 4,
    name: 'Alimento húmedo para gatos, Felix atún, 5kg',
    description: 'Alimento húmedo para gatos con atún, ideal para su dieta.',
    price: 5.45,
    stockQuantity: 25,
    categoryId: 3,
    imageUrl: 'https://purina.com.ec/sites/default/files/styles/webp/public/2022-08/atun_felix.png.webp?itok=FY1LeM9b'
  },
  {
    id: 5,
    name: 'Doglo: Golosinas de carne seca para perros',
    description: 'Golosinas de carne seca para perros, ideales para premiarlos.',
    price: 1.25,
    stockQuantity: 100,
    categoryId: 2,
    imageUrl: 'https://m.media-amazon.com/images/I/61wuLYvX6dL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    id: 6,
    name: 'Purina DogChow para razas medianas y grandes 25kg',
    description: 'Alimento balanceado para perros de razas medianas y grandes.',
    price: 35.00,
    stockQuantity: 20,
    categoryId: 2,
    imageUrl: 'https://purina.com.ec/sites/default/files/2023-09/VANITY-MKP-787-329_DC-MAXIMUS-TRIPLE-PROTEINA_CARNE-POLLO-PESCADO_05_AF_cv.png'
  },
  {
    id: 7,
    name: 'Michu Comida Para Gato, Sabor a Pollo 10Kg',
    description: 'Comida para gatos con sabor a pollo, ideal para tu felino.',
    price: 20.00,
    stockQuantity: 50,
    categoryId: 3,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfqLGSJk-igyH20-e-7vUvOsY01uyH53M-lg&s'
  },
  {
    id: 8,
    name: 'Bocaditos de la granja, Golosinas para gatos 45kg',
    description: 'Golosinas naturales para gatos, sabor a carne de la granja.',
    price: 15.30,
    stockQuantity: 60,
    categoryId: 3,
    imageUrl: 'https://www.profesionalvet.com.ar/1670-home_default/bocaditos-de-la-granja-45-grs.jpg'
  }
];

productsGroup5: Product[] = [
  {
    id: 1,
    name: 'CANI PREMIUM ADULTOS 4 Kg',
    description: 'Alimento premium para perros adultos, 4kg.',
    price: 20.00,
    stockQuantity: 20,
    categoryId: 2,
    imageUrl: 'https://shopconpatitas.com/cdn/shop/products/caniadultrmgsin.jpg?v=1636602166'
  }
];

  constructor(private router: Router, public authService: AuthService, private cartService: CartService, private activatedRoute: ActivatedRoute   ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      }
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
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

  

  openModal(product: Product): void {
    this.selectedProduct = product; // Asigna el producto seleccionado al modal
    const modal = new bootstrap.Modal(document.getElementById('productModal')!);
    modal.show();
  }

  closeModal(): void {
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide(); // Cierra el modal si está abierto
    }
    this.selectedProduct = null; // Limpia el producto seleccionado
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
