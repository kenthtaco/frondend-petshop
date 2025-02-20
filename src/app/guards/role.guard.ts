import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: any): boolean {
    const requiredRole = route.data.role;
    const userRole = this.authService.getRole();

    if (userRole === requiredRole) {
      return true;
    } else {
      this.router.navigate(['/']); // Redirigir a página no autorizada
      return false;
    }
  }
}
