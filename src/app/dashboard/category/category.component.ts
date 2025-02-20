import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { SidebarService } from '../sidebar/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Category = { name: '', description: '' };
  editingCategoryId?: number;
  isAdmin: boolean = false;
  isClosed: boolean = false;
  categoryName: string = ''; // Nombre de la categoría seleccionada
  categoryId: number = 0; // ID de la categoría seleccionada// Aseguramos que la categoría seleccionada tenga un nombre

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private sidebarService: SidebarService,
    private router: Router // Agregamos el servicio Router
  ) {}

  ngOnInit(): void {
    this.checkAdmin(); // Verificar si el usuario es Admin
    if (this.isAdmin) {
      this.loadCategories(); // Cargar categorías solo si es Admin
    }
  }

  

  checkAdmin(): void {
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      alert('Acceso denegado. Solo los administradores pueden gestionar categorías.');
    }
  }

  // Crear una nueva categoría
  createCategory(): void {
    if (this.isAdmin) {
      this.categoryService.createCategory(this.newCategory).subscribe(
        category => {
          this.categories.push(category);
          this.newCategory = { name: '', description: '' }; // Limpiar formulario
        },
        error => console.error('Error creating category', error)
      );
    } else {
      alert('No tienes permisos para realizar esta acción.');
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      categories => this.categories = categories,
      error => console.error('Error loading categories', error)
    );
  }

  // Redirigir a la vista de productos para esta categoría
  viewCategoryProducts(category: Category): void {
    this.categoryName = category.name; // Establecer el nombre de la categoría seleccionada
    this.router.navigate(['/products', category.id]); // Redirigir a la página de productos con el ID de la categoría
  }

  editCategory(): void {
    if (this.editingCategoryId) {
      // Actualizar una categoría existente
      this.categoryService.updateCategory(this.editingCategoryId, this.newCategory).subscribe(() => {
        this.resetForm();
        this.loadCategories(); // Recargar las categorías después de actualizar
      });
    } else {
      // Crear una nueva categoría
      this.categoryService.createCategory(this.newCategory).subscribe(() => {
        this.resetForm();
        this.loadCategories(); // Recargar las categorías después de crear
      });
    }
  }

  deleteCategory(id: number): void {
    if (this.isAdmin) {
      this.categoryService.deleteCategory(id).subscribe(
        (response) => {
          // Eliminar la categoría de la lista local
          this.categories = this.categories.filter((category) => category.id !== id);
          // Si el backend responde con un mensaje, lo puedes usar como feedback (opcional)
           
        },
        (error) => {
          console.error('Error al eliminar la categoría', error);
        }
      );
    } else {
      alert('No tienes permisos para realizar esta acción.');
    }
  }
  
  

  resetForm(): void {
    this.editingCategoryId = undefined;
    this.newCategory = { name: '', description: '' }; // Limpiar el formulario
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  setEditingCategory(category: Category): void {
    this.editingCategoryId = category.id;
    this.newCategory = { ...category }; // Cargar datos en el formulario
  }

  
}
