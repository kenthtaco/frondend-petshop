import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartItem } from 'src/app/models/cartitem.model';
import { OrderRequest } from 'src/app/models/order-request.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

declare var bootstrap: any;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  customerData: any = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    email: '',
    phone: '',
  }; // Datos del cliente
  paymentMethod: string = 'cash_on_delivery'; // Añadido el método de pago

  isSuccess: boolean = false;
  notificationMessage: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  clearCart(): void {
    this.cartService.clearCart(); // Llamada correcta al método clearCart
  }

  // Carga los productos del carrito desde el servicio
  loadCartItems(): void {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.calculateTotalPrice();
    });
  }

  // Calcula el precio total del carrito
  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  // Abre el modal para el formulario de datos del cliente
  openCustomerModal(): void {
    const modal = new bootstrap.Modal(document.getElementById('customerModal'));
    modal.show();
  }

  // Abre el modal para mostrar el resumen del pedido
  openSummaryModal(): void {
    const modal = new bootstrap.Modal(document.getElementById('summaryModal'));
    modal.show();
  }

  // Paso al siguiente modal, que es el resumen del pedido
  onNext(): void {
    const customerModal = bootstrap.Modal.getInstance(document.getElementById('customerModal'));
    customerModal.hide();
    this.openSummaryModal(); // Mostrar el resumen del pedido
  }

  // Confirmar el pago y enviar los datos al backend
  confirmPayment(): void {
    const order: OrderRequest = {
      totalAmount: this.totalPrice,
      orderDetails: this.cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      customerData: {
        firstName: this.customerData.firstName,
        lastName: this.customerData.lastName,
        address: this.customerData.address,
        city: this.customerData.city,
        email: this.customerData.email,
        phone: this.customerData.phone,
      },
      paymentMethod: this.paymentMethod, // Añadido paymentMethod
    };

    this.orderService.placeOrder(order).subscribe(
      (response) => {
        // Mostrar el modal de éxito
        this.isSuccess = true;
        this.notificationMessage = 'Pedido realizado con éxito';
        this.showNotificationModal();

        this.cartService.clearCart(); // Limpiar el carrito después del pago
        const summaryModal = bootstrap.Modal.getInstance(document.getElementById('summaryModal'));
        summaryModal.hide(); // Cerrar el modal de resumen
      },
      (error) => {
        // Mostrar el modal de error
        this.isSuccess = false;
        this.notificationMessage = 'Error al procesar el pedido';
        this.showNotificationModal();
      }
    );
  }

  // Muestra el modal de notificación y lo oculta después de 2 segundos
  showNotificationModal(): void {
    const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
    notificationModal.show();

    // Ocultar el modal después de 2 segundos
    setTimeout(() => {
      notificationModal.hide();
    }, 2000); // 2 segundos
  }

  // Elimina un producto del carrito usando el método del servicio
  removeFromCart(productId: number): void {
    this.cartService.removeProduct(productId); // Llama al método removeProduct del servicio
    this.loadCartItems(); // Vuelve a cargar los productos del carrito
  }
}
