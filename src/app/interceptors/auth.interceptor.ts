import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { TokenService } from '../services/token.service';
 // Servicio donde manejamos el token

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Obtener el token del servicio de token
    const token = this.tokenService.getToken();

    // Si el token existe, agregarlo al encabezado de la solicitud
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(clonedRequest);  // Continuar con la solicitud modificada
    }

    // Si no hay token, continuar con la solicitud sin modificarla
    return next.handle(req);
  }
}
