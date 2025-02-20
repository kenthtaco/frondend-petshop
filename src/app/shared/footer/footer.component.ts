import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [CommonModule],
})
export class FooterComponent {
  isVisible = true; // Inicialmente el footer es visible

  constructor(public authService: AuthService, private router: Router) {
    // Suscripción al estado de autenticación
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isVisible = !isAuthenticated; // Si el usuario está logueado, ocultar el footer
    });
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
