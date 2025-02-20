import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from 'src/app/models/cartitem.model';
import { Product } from 'src/app/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>(this.cartItems);

  // Método para agregar un producto al carrito
  addProduct(product: Product): void {
    // Verificamos si el producto tiene un id
    if (!product.id) {
      console.warn('Producto sin id, no se puede agregar al carrito.');
      return; // Evitamos agregar productos sin id
    }

    // Buscamos si el producto ya está en el carrito
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // Si el producto ya está en el carrito, incrementamos la cantidad
      existingItem.quantity++;
    } else {
      // Si no está, lo agregamos con cantidad 1
      this.cartItems.push({ 
        product: { 
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,  // Se guarda la URL de la imagen
          image: product.image         // O la imagen codificada en base64
        },
        quantity: 1
      });
    }

    // Emitimos los cambios al carrito
    this.cartItemsSubject.next(this.cartItems);
  }

  // Método para limpiar el carrito
  clearCart(): void {
    this.cartItems = [];  // Limpiar el arreglo de productos
    this.cartItemsSubject.next(this.cartItems); // Emitir el cambio
    console.log('Carrito limpiado');
  }

  // Obtener los productos en el carrito
  getCartItems() {
    return this.cartItemsSubject.asObservable();
  }

  // Método para eliminar un producto del carrito
  removeProduct(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(this.cartItems);
  }

  // Método para actualizar la cantidad de un producto en el carrito
  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.cartItemsSubject.next(this.cartItems);
    }
  }
}
