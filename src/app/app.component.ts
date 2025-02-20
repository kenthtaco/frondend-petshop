import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/header/header.component';
import { AuthService } from './services/auth.service'; // Asegúrate de importar el servicio de autenticación

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        SharedModule,
        HeaderComponent,
        FormsModule,
        RouterModule
    ]
})
export class AppComponent {
    constructor(private router: Router, private authService: AuthService) {}

    // Método para verificar si la ruta actual pertenece al dashboard
    isDashboardRoute(): boolean {
        return this.router.url.startsWith('/dashboard');
    }

    @ViewChild('categoriesContainer') categoriesContainer!: ElementRef;

    // Método para desplazar suavemente a las categorías
    scrollToCategories() {
        this.categoriesContainer.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    
}
