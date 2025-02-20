import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { SidebarService } from '../sidebar/sidebar.service';

declare const bootstrap: any; // Necesario para trabajar con modales de Bootstrap

@Component({
  selector: 'app-dashboard-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-products.component.html',
  styleUrls: ['./dashboard-products.component.scss']
})
export class DashboardProductsComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = { name: '', description: '', price: 0, stockQuantity: 0, categoryId: 0, imageUrl: '' };
  editingProductId?: number;
  isClosed: boolean = false;
  selectedImage: File | null = null; // Variable para almacenar la imagen seleccionada
  modalMessage: string = '';
  productToDeleteId: number | null = null; // Mensaje para el modal

  constructor(
    private productService: ProductService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    // Cargar productos al iniciar el componente
    this.loadProducts();
  }

  // Controlar el estado del sidebar
  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products; // Actualizamos la lista de productos desde el backend
        localStorage.setItem('products', JSON.stringify(products)); // Guardamos los productos en localStorage
      },
      (error) => {
        console.error('Error al cargar los productos desde el backend', error);

        // Si hay un error al cargar desde el backend, cargamos los productos del localStorage como respaldo
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
          this.products = JSON.parse(savedProducts);
        }
      }
    );
  }

  saveProduct(): void {
    const formData = new FormData();
  
    // Generar un código único para el producto
    if (!this.newProduct.productCode) {
      this.newProduct.productCode = this.generateProductCode(this.newProduct.name);
    }
  
    // Serializa el objeto del producto como JSON y agrégalo al FormData
    formData.append(
      'product',
      new Blob([JSON.stringify(this.newProduct)], { type: 'application/json' })
    );
  
    // Agrega la imagen seleccionada al FormData (si existe)
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
  
    if (this.editingProductId) {
      // Actualizar producto
      this.productService.updateProduct(this.editingProductId, formData).subscribe(
        () => {
          this.modalMessage = 'Producto actualizado con éxito.';
          this.showModal();
          this.resetForm();
          this.loadProducts();
        },
        (error) => {
          console.error('Error al actualizar el producto', error);
        }
      );
    } else {
      // Crear producto
      this.productService.createProduct(formData).subscribe(
        (createdProduct: Product) => {
          this.modalMessage = 'Producto guardado con éxito.';
          this.showModal();
          this.resetForm();
          this.products.push(createdProduct);
        },
        (error) => {
          console.error('Error al crear el producto', error);
        }
      );
    }
  }

  // Función para generar un código único para el producto
generateProductCode(productName: string): string {
  const timestamp = new Date().getTime(); // Obtener un timestamp único
  const uniqueCode = `${productName.substring(0, 3).toUpperCase()}-${timestamp}`; // Genera un código único
  return uniqueCode;
}

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.products = this.products.filter((product) => product.id !== id);
      },
      (error) => {
        console.error('Error al eliminar el producto', error);
      }
    );
  }

  // Método para editar un producto
  editProduct(product: Product): void {
    this.newProduct = { ...product };
    this.editingProductId = product.id;

    const formElement = document.getElementById('productForm'); 
    if (formElement) {
      this.smoothScrollTo(formElement.offsetTop, 600); 
    }
  }
  
  smoothScrollTo(targetY: number, duration: number): void {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2; 

      window.scrollTo(0, startY + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  resetForm(): void {
    this.newProduct = { name: '', description: '', price: 0, stockQuantity: 0, categoryId: 0, imageUrl: '' };
    this.editingProductId = undefined;
    this.selectedImage = null;
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.newProduct.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  showModal(): void {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openDeleteModal(id: number): void {
    this.productToDeleteId = id;
    this.showDeleteModal();
  }

  showDeleteModal(): void {
    const modalHTML = `
      <div id="productDeleteModal" class="modal fade" tabindex="-1" aria-labelledby="productDeleteModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          
          <!-- Header del modal -->
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title text-center" id="productDeleteModalLabel">Confirmar Borrado</h5>
          </div>

          <!-- Cuerpo del modal -->
          <div class="modal-body text-center">
            <p>¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
          </div>

          <!-- Footer del modal -->
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-danger" id="confirmDeleteButton">
              <i class="fas fa-trash-alt"></i> Eliminar
            </button>
            <button type="button" class="btn btn-secondary" id="cancelDeleteButton">
              <i class="fas fa-times-circle"></i> Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>`;

    // Insertar el modal en el DOM
    const bodyElement = document.body;
    bodyElement.insertAdjacentHTML('beforeend', modalHTML);

    // Mostrar el modal
    const modalElement = document.getElementById('productDeleteModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      // Asignar eventos a los botones
      const confirmDeleteButton = document.getElementById('confirmDeleteButton');
      const cancelDeleteButton = document.getElementById('cancelDeleteButton');
      
      if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', () => {
          this.confirmDelete();
          modal.hide(); // Cerrar el modal después de confirmar
        });
      }

      if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', () => {
          modal.hide(); // Cerrar el modal sin hacer nada
        });
      }

      // Evento para eliminar el modal después de ocultarlo
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.removeDeleteProductModal();
      });
    }
  }

  // Método para confirmar la eliminación
  confirmDelete(): void {
    if (this.productToDeleteId !== null) {
      this.productService.deleteProduct(this.productToDeleteId).subscribe(
        () => {
          this.products = this.products.filter(
            (product) => product.id !== this.productToDeleteId
          );
          this.closeDeleteModal(); // Cierra el modal después de eliminar
        },
        (error) => {
          console.error('Error al eliminar el producto', error);
        }
      );
    }
  }

  // Método para cerrar el modal
  closeDeleteModal(): void {
    const modalElement = document.getElementById('productDeleteModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }

  // Método para eliminar el modal del DOM
  removeDeleteProductModal(): void {
    const modalElement = document.getElementById('productDeleteModal');
    if (modalElement) {
      modalElement.remove(); // Eliminar el modal del DOM
    }
  }
}
