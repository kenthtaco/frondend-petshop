import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private TOKEN_KEY = 'jwt_token';  // Nombre de la clave en localStorage donde almacenamos el token

  // Guardar el token en localStorage
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Limpiar el token de localStorage
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Verificar si el token ha expirado
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;  // Si no hay token, se considera expirado
    }

    const decodedToken = this.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
      return true;  // Si no hay fecha de expiración, se considera expirado
    }

    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);  // La fecha de expiración en el token está en segundos

    return expirationDate < new Date();  // Verificar si la fecha de expiración ya pasó
  }

  // Función para decodificar el token (sin usar librerías externas)
  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token inválido');
      }
      const payload = parts[1];  // El payload está en la segunda parte del token
      const decoded = atob(payload);  // Decodificar la parte del payload usando atob
      return JSON.parse(decoded);     // Parsear el payload decodificado
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;  // Devolver null si hay un error
    }
  }

  // Método para obtener el ID del usuario del token JWT
  getUserId(): number {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token); // Decodificando el JWT
      if (decodedToken) {
        return decodedToken.userId || 0; // Asumimos que el JWT contiene el userId
      }
    }
    return 0; // Si no se puede obtener el userId, devolvemos 0
  }

  // Método para obtener los datos completos del cliente (decodificado)
  getCustomerData(): any {
    const token = this.getToken();
    if (token) {
      return this.decodeToken(token); // Devuelve los datos decodificados completos del usuario
    }
    return null;
  }
}
