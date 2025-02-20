// src/app/services/product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private adminUrl = 'http://localhost:8080/admin/products'; // URL base para productos de administrador
  private publicUrl = 'http://localhost:8080/api/products'; // URL base para productos públicos
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPublicProducts(); // Cargar productos públicos al inicializar el servicio
  }

  /**
   * Carga todos los productos públicos y los actualiza en el BehaviorSubject
   */
  private loadPublicProducts() {
    this.http.get<Product[]>(this.publicUrl).subscribe({
      next: (products) => this.productsSubject.next(products),
      error: (error) => console.error('Error al cargar productos públicos:', error),
    });
  }

  /**
   * Devuelve todos los productos disponibles desde el BehaviorSubject
   */
  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  /**
   * Obtiene un producto por su ID
   */
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.publicUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener el producto:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene productos filtrados por categoría
   */
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.publicUrl}?categoryId=${categoryId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener productos por categoría:', error);
        throw error;
      })
    );
  }

  /**
   * Crea un nuevo producto (Solo para ADMIN)
   */
  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.adminUrl, formData).pipe(
      tap(() => this.loadPublicProducts()), // Recargar productos públicos después de crear
      catchError((error) => {
        console.error('Error al crear el producto:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza un producto existente (Solo para ADMIN)
   */
  updateProduct(id: number, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.adminUrl}/${id}`, formData).pipe(
      tap(() => this.loadPublicProducts()), // Recargar productos públicos después de actualizar
      catchError((error) => {
        console.error('Error al actualizar el producto:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina un producto por su ID (Solo para ADMIN)
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`).pipe(
      tap(() => this.loadPublicProducts()), // Recargar productos públicos después de eliminar
      catchError((error) => {
        console.error('Error al eliminar el producto:', error);
        throw error;
      })
    );
  }
}
