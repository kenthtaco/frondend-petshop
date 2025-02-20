import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';

@NgModule({

  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,  // Importar el componente standalone
    FooterComponent,

    LoadingSpinnerModule   // Importar el componente standalone
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    RouterModule
  ]
})
export class SharedModule { }
