import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [FormsModule],  // Agrega FormsModule aquí
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'] // Corregí "styleUrl" a "styleUrls" (debe ser plural)
})
export class ComentariosComponent {
  comentarios = [
    { nombre: 'Juan Pérez', comentario: 'Excelente producto, lo recomiendo mucho.' },
    { nombre: 'Ana Gómez', comentario: 'Muy buen precio y calidad.' }
  ];

  nuevoComentario = {
    nombre: '',
    comentario: ''
  };

  onSubmit() {
    if (this.nuevoComentario.nombre && this.nuevoComentario.comentario) {
      this.comentarios.push({ ...this.nuevoComentario });
      this.nuevoComentario.nombre = '';
      this.nuevoComentario.comentario = '';
    }
  }
}
