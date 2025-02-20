import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderRequest, OrderResponse } from 'src/app/services/order.service';
import { OrderService } from 'src/app/services/order.service';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-dashboard-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-order.component.html',
  styleUrls: ['./dashboard-order.component.scss']
})
export class DashboardOrderComponent implements OnInit {
  orders: OrderResponse[] = []; // Lista de pedidos cargados desde el backend
  newOrder: OrderRequest = {
    customerData: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      email: '',
      phone: ''
    },
    totalAmount: 0,
    orderDetails: [],
    paymentMethod: 'cash_on_delivery' // Asegúrate de incluir paymentMethod
  }; // Pedido nuevo basado en el formulario o carrito
  selectedOrder: OrderResponse | null = null; // Pedido seleccionado para ver detalles
  isSidebarClosed: boolean = false; // Estado del sidebar

  constructor(
    private orderService: OrderService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.loadOrders(); // Cargar todos los pedidos al inicializar el componente
  }

  // Alternar el estado del sidebar
  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  // Cargar todos los pedidos del backend (para el admin)
  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      (orders) => {
        this.orders = orders;
      },
      (error) => {
        console.error('Error al cargar pedidos', error);
      }
    );
  }

  // Procesar un nuevo pedido (para el cliente)
  processOrder(): void {
    if (this.newOrder.orderDetails.length === 0) {
      console.warn('El pedido debe tener al menos un detalle.');
      return;
    }

    this.newOrder.totalAmount = this.calculateTotalAmount();

    // Asegúrate de que paymentMethod tenga un valor antes de procesar el pedido
    if (!this.newOrder.paymentMethod) {
      console.warn('Debe seleccionar un método de pago.');
      return;
    }

    // Llamar al servicio para colocar un nuevo pedido (cliente)
    this.orderService.placeOrder(this.newOrder).subscribe(
      (orderResponse) => {
        console.log('Pedido procesado con éxito', orderResponse);
        this.loadOrders(); // Recargar la lista de pedidos (admin)
        this.resetOrderForm(); // Limpiar el formulario de pedido
      },
      (error) => {
        console.error('Error al procesar el pedido', error);
      }
    );
  }

  // Calcular el monto total del pedido (para el cliente)
  calculateTotalAmount(): number {
    return this.newOrder.orderDetails.reduce(
      (total, detail) => total + detail.quantity * detail.price,
      0
    );
  }

   // Método para eliminar la orden
   deleteOrder(orderId: number): void {
    this.orderService.deleteOrder(orderId).subscribe(
      () => {
        // Después de eliminar, recargar la lista de órdenes
        this.loadOrders();
      },
      (error) => {
        console.error('Error al eliminar la orden', error);
      }
    );
  }

  // Limpiar el formulario de nuevo pedido (para el cliente)
  resetOrderForm(): void {
    this.newOrder = {
      customerData: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        email: '',
        phone: ''
      },
      totalAmount: 0,
      orderDetails: [],
      paymentMethod: 'cash_on_delivery' // Reiniciar paymentMethod
    };
  }
}
