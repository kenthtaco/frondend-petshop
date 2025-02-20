import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080'; // URL base del backend
  private loggedIn = new BehaviorSubject<boolean>(false); // Estado de autenticación
  private registered = new BehaviorSubject<boolean>(false); // Estado de registro
  private userRoleSubject = new BehaviorSubject<string | null>(null); // Estado del rol del usuario

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  // Obtener el token JWT almacenado
  getToken(): string | null {
    return this.tokenService.getToken();
  }

  // Método para obtener el rol del usuario desde el token JWT
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken = this.decodeToken(token);
      return decodedToken?.roles || null; // Cambié 'role' por 'roles' según el cambio realizado en el backend
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Decodificar el token JWT
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  // Métodos de registro para diferentes tipos de usuarios
  registerAdmin(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/admin`, user).pipe(
      tap((response: any) => this.handleAuthResponse(response)),
      catchError((error) => {
        console.error('Error during admin registration:', error);
        throw error;
      })
    );
  }

  registerSeller(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/seller`, user).pipe(
      tap((response: any) => this.handleAuthResponse(response)),
      catchError((error) => {
        console.error('Error during seller registration:', error);
        throw error;
      })
    );
  }

  registerCustomer(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/customer`, user).pipe(
      tap((response: any) => this.handleAuthResponse(response)),
      catchError((error) => {
        console.error('Error during customer registration:', error);
        throw error;
      })
    );
  }

  // Método de login
 // Método de login
 login(credentials: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/login`, credentials).pipe(
    tap((response: any) => {
      this.handleAuthResponse(response);
      
      // Almacenar el userId en localStorage (o en el servicio TokenService)
      if (response && response.user && response.user.id) {
        localStorage.setItem('userId', response.user.id); // Guardamos el userId
      }
    }),
    catchError((error) => {
      console.error('Error during login:', error);
      throw error;
    })
  );
}



  // Manejar respuesta de autenticación (guardar token y rol)
  private handleAuthResponse(response: any): void {
    const token = response?.token;
    if (token) {
      this.tokenService.setToken(token); // Guardar token en el servicio de tokens
      this.loggedIn.next(true); // Cambiar el estado de autenticación a verdadero
      this.setUserRole(token); // Establecer el rol del usuario
    }
  }

  // Establecer el rol desde el token
  private setUserRole(token: string): void {
    const decodedToken = this.decodeToken(token);
    const roles = decodedToken?.roles || null; // Cambié 'role' por 'roles' según el backend
    this.userRoleSubject.next(roles); // Actualizar el rol en el BehaviorSubject
  }

  // Obtener el rol del usuario como Observable
  getUserRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  // Validar si el usuario es Admin
  isAdmin(): boolean {
    const role = this.getRole();
    // Verifica si role no es null y contiene 'ROLE_ADMIN'
    return role !== null && role.includes('ROLE_ADMIN');
  }
  

  // Método de logout
  logout(): void {
    this.tokenService.clearToken(); // Limpiar el token de sesión
    this.loggedIn.next(false); // Cambiar el estado a no autenticado
    this.registered.next(false); // Cambiar el estado a no registrado
    this.userRoleSubject.next(null); // Limpiar el rol cuando se hace logout
  }

  // Validar si el usuario está autenticado basado en el token
  // Validar si el usuario está autenticado basado en el token
isLoggedIn(): boolean {
  const token = this.getToken();
  if (!token) return false;

  try {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) return false;

    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);

    return expirationDate > new Date(); // Verificar si el token no ha expirado
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}


  // Observable para el estado de autenticación
  isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Observable para el estado de registro
  isRegistered(): Observable<boolean> {
    return this.registered.asObservable();
  }
}
