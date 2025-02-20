import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/admin/categories'; // Endpoint protegido por ADMIN
  private selectedCategorySource = new BehaviorSubject<string>(''); // Estado para la categoría seleccionada
  selectedCategory$ = this.selectedCategorySource.asObservable();

  constructor(private http: HttpClient) { }

  // Obtener categorías (incluye el token JWT en las cabeceras)
  getCategories(): Observable<Category[]> {
    const token = localStorage.getItem('token'); // Obtener el token desde el localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Incluir el token en las cabeceras

    return this.http.get<Category[]>(this.apiUrl, { headers }); // Hacer la solicitud GET con las cabeceras
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Verificar si ya existe una categoría con el mismo nombre
  checkCategoryExistence(name: string): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Category[]>(this.apiUrl, { headers }).pipe(
      map(categories => categories.some(category => category.name === name)) // Verifica si el nombre ya existe
    );
  }

  // Crear categoría con validación para evitar duplicados
  createCategory(category: Category): Observable<Category> {
    return this.checkCategoryExistence(category.name).pipe(
      switchMap(exists => {
        if (exists) {
          throw new Error('La categoría ya existe');
        } else {
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          return this.http.post<Category>(this.apiUrl, category, { headers });
        }
      })
    );
  }

  // Actualizar categoría
  updateCategory(id: number, category: Category): Observable<Category> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, { headers });
  }

  // Eliminar categoría
  deleteCategory(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  // Método para actualizar la categoría seleccionada
  setSelectedCategory(categoryName: string) {
    this.selectedCategorySource.next(categoryName);
  }
}
